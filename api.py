"""
Vercel Serverless Function Entry Point
Routes API requests to Flask application
"""

import os
import sys

# Add GmailReader to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'GmailReader'))

from GmailReader.api_server import app

# Export the Flask app for Vercel
def handler(request):
    """Vercel serverless handler"""
    return app(request)
