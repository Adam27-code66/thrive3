import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.api.analyze import router as analyze_router
from app.api.incidents import router as incidents_router
from app.api.dashboard import router as dashboard_router
from app.api.reports import router as reports_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("phishlens")

# Create DB Tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
    
    # Auto-seed demo incidents on startup
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Demo incidents checked/seeded.")
    finally:
        db.close()
except Exception as e:
    logger.error(f"Error initializing DB on startup: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Explainable Phishing Investigation & Incident Response Platform API"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel Path Rewriting Middleware
@app.middleware("http")
async def fix_api_index_path(request, call_next):
    # Retrieve real requested URI forwarded by Vercel
    forwarded_uri = request.headers.get("x-forwarded-uri") or request.headers.get("x-invoke-path")
    
    if forwarded_uri:
        raw_path = forwarded_uri.split("?")[0]
        if raw_path != "/" and not raw_path.startswith("/api/"):
            request.scope["path"] = f"/api{raw_path}"
        else:
            request.scope["path"] = raw_path
    else:
        path = request.url.path
        if path == "/api/index" or path == "/api/index/":
            request.scope["path"] = "/"
        elif path.startswith("/api/index/"):
            sub_path = path[10:]
            if sub_path != "/" and not sub_path.startswith("/api/"):
                request.scope["path"] = f"/api{sub_path}"
            else:
                request.scope["path"] = sub_path
                
    return await call_next(request)



# Register Routers
app.include_router(analyze_router)
app.include_router(incidents_router)
app.include_router(dashboard_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "platform": settings.APP_NAME,
        "tagline": settings.TAGLINE,
        "status": "online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
