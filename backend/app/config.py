import os

class Settings:
    APP_NAME: str = "PhishLens"
    APP_VERSION: str = "1.0.0"
    TAGLINE: str = "Detect. Explain. Respond."
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./phishlens.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "phishlens_hackathon_super_secret_key_2026")
    
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
