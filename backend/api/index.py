"""
Vercel Serverless Entry Point for PhishLens FastAPI backend.

Mangum wraps the FastAPI ASGI app to make it compatible with
AWS Lambda-style serverless environments (which Vercel Python uses).
"""
import sys
import os

# Ensure the backend root is on the Python path so `app.*` imports resolve.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mangum import Mangum
from app.main import app

# Vercel looks for a variable named `handler` in api/index.py
handler = Mangum(app, lifespan="off")
