import logging
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("phishlens.database")

db_url = settings.DATABASE_URL

# On Vercel (and other serverless platforms), only /tmp is writable.
# Remap a relative SQLite path to /tmp.
if db_url.startswith("sqlite:///./"):
    db_file = db_url[len("sqlite:///./"):]
    db_url = f"sqlite:////tmp/{db_file}"
elif db_url == "sqlite:///phishlens.db":
    db_url = "sqlite:////tmp/phishlens.db"

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({db_url}): {e}. Falling back to SQLite.")
    db_url = "sqlite:////tmp/phishlens.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
