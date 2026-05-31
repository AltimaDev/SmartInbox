"""
Gmail Reader Module
Handles authentication and email retrieval from Gmail API
"""

import os
import threading
import pickle
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient import discovery
import base64
from email.mime.text import MIMEText

# Fix SSL issues on Windows
import ssl
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
CREDENTIALS_DIR = os.path.join(os.path.dirname(__file__), 'credentials')
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, 'token.pickle')
CREDENTIALS_FILE = os.path.join(CREDENTIALS_DIR, 'credentials.json')


class GmailReader:
    """Authenticate and interact with Gmail API"""
    
    def __init__(self):
        """Initialize Gmail Reader with authentication"""
        self.creds = None
        self._local = threading.local()
        self.authenticate()
    
    @property
    def service(self):
        if not hasattr(self._local, 'service') or self._local.service is None:
            self._local.service = discovery.build('gmail', 'v1', credentials=self.creds)
        return self._local.service
    
    def authenticate(self):
        """Authenticate with Gmail API using OAuth 2.0"""
        creds = None
        
        # Load existing token if available
        if os.path.exists(TOKEN_FILE):
            with open(TOKEN_FILE, 'rb') as token:
                creds = pickle.load(token)
        
        # If no valid credentials, get new ones
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(CREDENTIALS_FILE):
                    raise FileNotFoundError(
                        f"credentials.json not found at {CREDENTIALS_FILE}\n"
                        "Please download it from Google Cloud Console."
                    )
                
                flow = InstalledAppFlow.from_client_secrets_file(
                    CREDENTIALS_FILE, SCOPES
                )
                creds = flow.run_local_server(port=0)
            
            # Save credentials for future use
            os.makedirs(CREDENTIALS_DIR, exist_ok=True)
            with open(TOKEN_FILE, 'wb') as token:
                pickle.dump(creds, token)
        
        self.creds = creds
        self._local.service = discovery.build('gmail', 'v1', credentials=creds)
        print("[OK] Gmail authentication successful!")
    
    def get_emails(self, query='is:unread', max_results=10):
        """
        Retrieve emails based on query
        
        Args:
            query (str): Gmail search query (default: unread emails)
            max_results (int): Maximum number of emails to retrieve
            
        Returns:
            list: List of email message IDs
        """
        try:
            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            print(f"[OK] Found {len(messages)} emails matching query: {query}")
            return messages
            
        except Exception as e:
            print(f"[ERROR] Error retrieving emails: {str(e)}")
            return []
    
    def get_email_details(self, message_id):
        """
        Get full email details including content
        
        Args:
            message_id (str): Email message ID
            
        Returns:
            dict: Email details and content
        """
        try:
            message = self.service.users().messages().get(
                userId='me',
                id=message_id,
                format='full'
            ).execute()
            
            return message
            
        except Exception as e:
            print(f"[ERROR] Error retrieving email details: {str(e)}")
            return None
    
    def get_email_headers(self, message):
        """Extract email headers"""
        headers = message['payload']['headers']
        header_dict = {header['name']: header['value'] for header in headers}
        return header_dict
    
    def get_email_body(self, message):
        """
        Extract email body (handles both plain text and HTML, including nested parts)
        
        Args:
            message (dict): Email message object
            
        Returns:
            str: Email body content
        """
        try:
            html_body = None
            plain_body = None

            def _walk_parts(payload):
                nonlocal html_body, plain_body
                
                mime_type = payload.get('mimeType', '')
                
                # If this part has nested parts, recurse into them
                if 'parts' in payload:
                    for part in payload['parts']:
                        _walk_parts(part)
                    return
                
                # Leaf part — extract data
                data = payload.get('body', {}).get('data')
                if not data:
                    return
                    
                decoded = base64.urlsafe_b64decode(data).decode('utf-8', errors='replace')
                
                if mime_type == 'text/html' and html_body is None:
                    html_body = decoded
                elif mime_type == 'text/plain' and plain_body is None:
                    plain_body = decoded
            
            _walk_parts(message['payload'])
            
            # Prefer HTML for rich rendering, fall back to plain text
            if html_body:
                return html_body
            if plain_body:
                return plain_body
            
            return "No body content found"
            
        except Exception as e:
            print(f"[ERROR] Error extracting body: {str(e)}")
            return ""


def main():
    """Example usage"""
    try:
        # Initialize Gmail reader
        gmail = GmailReader()
        
        # Get latest unread emails
        emails = gmail.get_emails(query='is:unread', max_results=5)
        
        # Process each email
        for email in emails:
            message = gmail.get_email_details(email['id'])
            if message:
                headers = gmail.get_email_headers(message)
                body = gmail.get_email_body(message)
                
                print("\n" + "="*50)
                print(f"From: {headers.get('From', 'N/A')}")
                print(f"Subject: {headers.get('Subject', 'N/A')}")
                print(f"Date: {headers.get('Date', 'N/A')}")
                print("="*50)
                print(f"Body:\n{body[:500]}...")  # First 500 chars
                
    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == '__main__':
    main()

