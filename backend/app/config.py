import os

class Settings:
    APP_NAME: str = "PhishLens"
    APP_VERSION: str = "1.0.0"
    TAGLINE: str = "Detect. Explain. Respond."
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./phishlens.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "phishlens_hackathon_super_secret_key_2026")
    
    # In production set CORS_ORIGINS env var to your Vercel URL, e.g.:
    # https://thrive3.vercel.app,https://thrive3-git-main-adam27.vercel.app
    _cors_env = os.getenv("CORS_ORIGINS", "")
    CORS_ORIGINS: list = (
        [o.strip() for o in _cors_env.split(",") if o.strip()]
        if _cors_env
        else [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "*",
        ]
    )

settings = Settings()

