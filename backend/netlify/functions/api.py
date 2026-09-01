"""
Netlify Serverless Function — PhishLens FastAPI backend.

Netlify runs Python functions as AWS Lambda-compatible handlers.
Mangum wraps the FastAPI ASGI app to match that interface.
"""
import sys
import os

# Make sure `app.*` imports resolve (function runs from the repo root)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from mangum import Mangum
from app.main import app

# Netlify expects a function called `handler`
_handler = Mangum(app, lifespan="off")

def handler(event, context):
    return _handler(event, context)
