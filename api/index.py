"""
Vercel API Functions Directory
Place all Flask routes here for Vercel serverless deployment
"""

import os
import sys

# Add workspace root to path for imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(project_root, 'GmailReader'))

from GmailReader.api_server import app
from flask import Request as FlaskRequest

def api_handler(request):
    """
    Vercel serverless handler for all /api/* routes
    Converts Vercel request to Flask WSGI format
    """
    with app.test_request_context(
        path=request.path,
        method=request.method,
        headers=request.headers,
        data=request.get_body(),
        environ_base=request.environ
    ):
        return app.dispatch_request()
