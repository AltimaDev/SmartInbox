"""
Vercel Serverless Function for Gmail Reader API
Routes requests to the Flask application
"""

import os
import sys
from pathlib import Path

# Add GmailReader module to path
gmail_reader_path = str(Path(__file__).parent.parent / "GmailReader")
sys.path.insert(0, gmail_reader_path)

from api_server import app

# Export app as WSGI application for Vercel
def handler(request):
    return app(request)

