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
    # 1. Check if Vercel passed path via rewrite query param ?path=...
    qp_path = request.query_params.get("path")
    # 2. Check headers forwarded by proxy
    forwarded_uri = request.headers.get("x-forwarded-uri") or request.headers.get("x-invoke-path")
    
    target_path = ""
    if qp_path is not None:
        target_path = f"/{qp_path.lstrip('/')}"
    elif forwarded_uri:
        target_path = forwarded_uri.split("?")[0]
        
    if target_path:
        if target_path in ["/", "/api/index", "/api/index/"]:
            request.scope["path"] = "/"
        elif not target_path.startswith("/api/"):
            request.scope["path"] = f"/api{target_path}"
        else:
            request.scope["path"] = target_path
            
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
