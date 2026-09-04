import logging
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("phishlens.database")

db_url = settings.DATABASE_URL

# Resolve SQLite path — cross-platform:
# - On Linux/Vercel: only /tmp is writable, remap there
# - On Windows (local dev): use a local file path in the backend dir
if db_url.startswith("sqlite:///./") or db_url == "sqlite:///phishlens.db":
    db_file = db_url.replace("sqlite:///./", "").replace("sqlite:///", "")
    if sys.platform == "win32":
        # Local Windows dev — store next to the backend folder
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, db_file)
        db_url = f"sqlite:///{db_path}"
    else:
        # Linux / Vercel serverless — /tmp is the only writable dir
        db_url = f"sqlite:////tmp/{db_file}"

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
    with engine.connect() as conn:
        pass
    logger.info(f"Connected to database: {db_url}")
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({db_url}): {e}. Falling back to in-memory SQLite.")
    db_url = "sqlite://"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
