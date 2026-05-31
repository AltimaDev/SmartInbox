"""
Vercel Serverless API Endpoint
Handles all API requests by delegating to Flask app
"""
import os
import sys
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Add GmailReader module to path
sys.path.insert(0, str(Path(__file__).parent.parent / "GmailReader"))

logger.info("Loading Flask app...")
from api_server import app

# For Vercel Python Functions
def handler(request):
    """Vercel handler for HTTP requests"""
    logger.info(f"Request: {request.method} {request.path}")
    
    # Use Flask's test client in request context
    with app.test_client() as client:
        method = request.method.lower()
        client_method = getattr(client, method)
        
        # Make request
        response = client_method(
            request.path + (f"?{request.query_string}" if request.query_string else ""),
            data=request.body if request.body else None,
            headers=dict(request.headers),
            content_type=request.headers.get('content-type')
        )
        
        logger.info(f"Response: {response.status_code}")
        
        return {
            'statusCode': response.status_code,
            'headers': dict(response.headers),
            'body': response.get_data(as_text=True),
            'isBase64Encoded': False
        }




