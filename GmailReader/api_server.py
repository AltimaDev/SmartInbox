"""
Flask API Server for Gmail Reader
Provides REST endpoints for the React frontend to consume
"""

# Fix SSL issues on Windows
import ssl
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gmail_reader import GmailReader
from email_parser import EmailExtractor, EmailParser
from datetime import datetime, timedelta
import json
import csv
import io
import os
import time
import re

app = Flask(__name__)

# Configure CORS for both local development and Vercel production
if os.getenv('VERCEL'):
    # Production: allow the Vercel app domain
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    # Development: allow localhost ports
    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:5173", 
        "http://localhost:5174"
    ]}})

# Store Gmail reader instance
gmail_instance = None
email_cache = {}

def get_gmail_reader():
    """Get or initialize Gmail reader"""
    global gmail_instance
    if gmail_instance is None:
        try:
            gmail_instance = GmailReader()
        except Exception as e:
            print(f"Error initializing Gmail reader: {e}")
            return None
    return gmail_instance

def extract_amounts(text):
    """Extract monetary amounts from email text. Returns a list of floats."""
    amounts = []
    # Patterns: $1,234.56 | USD 1,234.56 | ₹1,234.56 | INR 1,234.56 | Rs. 1,234.56 | EUR 1,234
    patterns = [
        r'(?:[$€£¥₹])\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',                # Symbol prefix: $1,234.56
        r'(?:USD|INR|EUR|GBP|AUD|CAD|Rs\.?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',  # Code prefix: USD 1,234.56
        r'(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:USD|INR|EUR|GBP|AUD|CAD)',        # Code suffix: 1,234.56 USD
        r'(?:amount|total|paid|charged|debited|credited|price|cost|fee|balance)[:\s]+(?:[$€£¥₹]|(?:USD|INR|EUR|GBP|Rs\.?))?[\s]*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',  # Contextual: amount: 1234.56
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for m in matches:
            try:
                val = float(m.replace(',', ''))
                if 0.01 <= val <= 10_000_000:  # Filter unreasonable values
                    amounts.append(val)
            except ValueError:
                pass
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for a in amounts:
        if a not in seen:
            seen.add(a)
            unique.append(a)
    return unique

def format_email_for_frontend(email_id, headers, body, message=None):
    """Format email data to match frontend expectations"""
    try:
        # Extract header information
        from_header = headers.get('From', 'Unknown')
        from_name = from_header.split('<')[0].strip() if '<' in from_header else from_header
        
        # Parse date
        date_str = headers.get('Date', '')
        try:
            # Gmail date format: Mon, 30 May 2024 14:30:00 +0000
            parsed_date = datetime.strptime(date_str[:16], '%a, %d %b %Y')
            date = parsed_date.strftime('%Y-%m-%d')
            time = parsed_date.strftime('%I:%M %p')
        except:
            date = datetime.now().strftime('%Y-%m-%d')
            time = datetime.now().strftime('%I:%M %p')
        
        # Extract content using EmailExtractor
        subject = headers.get('Subject', 'No Subject')
        extractor = EmailExtractor(
            subject=subject,
            body=body,
            sender=from_header
        )
        
        extracted = extractor.extract_all()
        
        # Determine category based on source keywords
        subject_lower = subject.lower()
        body_lower = body.lower()
        content_lower = subject_lower + " " + body_lower
        
        # 1. Payment Category
        payment_keywords = ['invoice', 'payment', 'expense', 'finance', 'bill', 'receipt', 'stripe', 'paypal', 'bank', 'transaction', 'paid', 'charge', 'statement']
        
        # 2. Education Category
        education_keywords = ['course', 'class', 'lecture', 'learn', 'education', 'university', 'college', 'assignment', 'exam', 'tutorial', 'udemy', 'coursera', 'academy', 'school', 'student']
        
        # 3. Work Category
        work_keywords = ['interview', 'hiring', 'hr', 'recruitment', 'job', 'resume', 'career', 'offer letter', 'work', 'meeting', 'project']
        
        # 4. Promo Category
        promo_keywords = ['sale', 'discount', 'offer', 'coupon', 'deal', 'promotion', 'shop', 'marketing']
        
        if any(keyword in content_lower for keyword in payment_keywords):
            category = 'Payment'
        elif any(keyword in content_lower for keyword in education_keywords):
            category = 'Education'
        elif any(keyword in content_lower for keyword in work_keywords):
            category = 'Work'
        elif any(keyword in content_lower for keyword in promo_keywords) or extracted.get('is_promotional'):
            category = 'Promo'
        else:
            category = 'Information' # Default category for newsletters, security updates, alerts, etc.
        
        # Extract monetary amounts from payment emails
        amounts = []
        total_amount = 0
        if category == 'Payment':
            amounts = extract_amounts(subject + " " + body)
            total_amount = sum(amounts)
        
        return {
            'id': email_id,
            'from': from_header,
            'fromName': from_name,
            'to': headers.get('To', 'N/A'),
            'subject': subject,
            'date': date,
            'time': time,
            'category': category,
            'body': body[:1000],  # Preview
            'fullBody': body,
            'urls': extracted.get('urls', []),
            'emails': extracted.get('email_addresses', []),
            'phones': extracted.get('phone_numbers', []),
            'summary': f"{extracted.get('summary', {}).get('preview', '')}",
            'read': True,
            'isAlert': extracted.get('is_alert', False),
            'isPromo': extracted.get('is_promotional', False),
            'amounts': amounts,
            'totalAmount': total_amount
        }
    except Exception as e:
        print(f"Error formatting email: {e}")
        return None

def fetch_single_email(msg_id):
    """Fetch and format a single email (using global email_cache or Gmail API)"""
    global email_cache
    if msg_id in email_cache:
        return email_cache[msg_id]
        
    gmail = get_gmail_reader()
    if not gmail:
        return None
        
    for attempt in range(3):
        try:
            message = gmail.get_email_details(msg_id)
            if message:
                headers = gmail.get_email_headers(message)
                body = gmail.get_email_body(message)
                formatted = format_email_for_frontend(msg_id, headers, body, message)
                if formatted:
                    email_cache[msg_id] = formatted
                    return formatted
            break
        except Exception as e:
            print(f"Error getting email {msg_id}, attempt {attempt + 1}: {str(e)}")
            if attempt < 2:
                import time
                time.sleep(0.5)
    return None

# ==================== API Routes ====================

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        return jsonify({
            'status': 'success',
            'message': 'Gmail Reader API is running'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/gmail/status', methods=['GET'])
def gmail_status():
    """Get Gmail connection status"""
    try:
        gmail = get_gmail_reader()
        if gmail is None:
            return jsonify({
                'status': 'success',
                'data': {
                    'connected': False,
                    'message': 'Gmail not connected. Please check credentials.json'
                }
            }), 200
        
        return jsonify({
            'status': 'success',
            'data': {
                'connected': True,
                'email': 'Gmail Account (OAuth)',
                'lastSync': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/emails', methods=['GET'])
def get_emails():
    """
    Get emails from Gmail
    Query parameters:
    - search: Search query
    - category: Filter by category
    - limit: Max results (default 20)
    - offset: Pagination offset (default 0)
    """
    try:
        gmail = get_gmail_reader()
        if gmail is None:
            return jsonify({
                'status': 'error',
                'message': 'Gmail not connected'
            }), 503
        
        search = request.args.get('search', '')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        category = request.args.get('category', 'All')
        if not category:
            category = 'All'
        
        # Build Gmail query
        gmail_query = 'in:inbox'
        
        if search:
            # Search in subject and body
            gmail_query += f' (subject:{search} OR from:{search})'
        
        # Get emails from Gmail with retry logic
        messages = None
        max_retries = 3
        for attempt in range(max_retries):
            try:
                messages = gmail.get_emails(query=gmail_query, max_results=limit + offset)
                break
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    import time
                    time.sleep(1)  # Wait before retry
                else:
                    print(f"Failed to get emails after {max_retries} attempts")
                    return jsonify({
                        'status': 'error',
                        'message': f'Failed to fetch emails: {str(e)}'
                    }), 503
        
        if not messages:
            return jsonify({
                'status': 'success',
                'data': {
                    'emails': [],
                    'total_count': 0,
                    'unread_count': 0
                }
            })
        
        # Process emails in parallel using ThreadPoolExecutor
        from concurrent.futures import ThreadPoolExecutor
        
        target_messages = messages[offset:offset+limit]
        
        # Check cache first for what is available
        results_by_id = {}
        uncached_ids = []
        
        for msg in target_messages:
            msg_id = msg['id']
            if msg_id in email_cache:
                results_by_id[msg_id] = email_cache[msg_id]
            else:
                uncached_ids.append(msg_id)
                
        # Fetch uncached emails in parallel
        if uncached_ids:
            with ThreadPoolExecutor(max_workers=10) as executor:
                # Schedule tasks
                futures = {executor.submit(fetch_single_email, msg_id): msg_id for msg_id in uncached_ids}
                for future in futures:
                    msg_id = futures[future]
                    try:
                        formatted = future.result()
                        if formatted:
                            results_by_id[msg_id] = formatted
                    except Exception as e:
                        print(f"Error in parallel processing of email {msg_id}: {str(e)}")
                        
        # Construct formatted_emails list in original order, applying category filter
        formatted_emails = []
        for msg in target_messages:
            msg_id = msg['id']
            if msg_id in results_by_id:
                formatted = results_by_id[msg_id]
                if category == 'All' or formatted['category'] == category:
                    formatted_emails.append(formatted)
        
        return jsonify({
            'status': 'success',
            'data': {
                'emails': formatted_emails,
                'total_count': len(messages),
                'unread_count': len(formatted_emails)
            }
        })
    
    except Exception as e:
        print(f"Error in get_emails: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/emails/<email_id>', methods=['GET'])
def get_email_details(email_id):
    """Get details for a specific email"""
    try:
        gmail = get_gmail_reader()
        if gmail is None:
            return jsonify({
                'status': 'error',
                'message': 'Gmail not connected'
            }), 503
        
        message = gmail.get_email_details(email_id)
        if not message:
            return jsonify({
                'status': 'error',
                'message': 'Email not found'
            }), 404
        
        headers = gmail.get_email_headers(message)
        body = gmail.get_email_body(message)
        
        formatted = format_email_for_frontend(email_id, headers, body, message)
        
        return jsonify({
            'status': 'success',
            'data': formatted
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/emails/export/json', methods=['POST'])
def export_json():
    """Export emails as JSON"""
    try:
        data = request.get_json()
        emails = data.get('emails', [])
        
        output = io.BytesIO()
        output.write(json.dumps(emails, indent=2).encode('utf-8'))
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/json',
            as_attachment=True,
            download_name='emails.json'
        )
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/emails/export/csv', methods=['POST'])
def export_csv():
    """Export emails as CSV"""
    try:
        data = request.get_json()
        emails = data.get('emails', [])
        
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=['from', 'subject', 'date', 'category', 'summary'])
        writer.writeheader()
        
        for email in emails:
            writer.writerow({
                'from': email.get('fromName', ''),
                'subject': email.get('subject', ''),
                'date': email.get('date', ''),
                'category': email.get('category', ''),
                'summary': email.get('summary', '')[:100]
            })
        
        output.seek(0)
        output_bytes = io.BytesIO(output.getvalue().encode('utf-8'))
        output_bytes.seek(0)
        
        return send_file(
            output_bytes,
            mimetype='text/csv',
            as_attachment=True,
            download_name='emails.csv'
        )
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/emails/search', methods=['GET'])
def search_emails():
    """Search emails with advanced filters"""
    try:
        gmail = get_gmail_reader()
        if gmail is None:
            return jsonify({
                'status': 'error',
                'message': 'Gmail not connected'
            }), 503
        
        search = request.args.get('q', '')
        sender = request.args.get('sender', '')
        from_date = request.args.get('from_date', '')
        to_date = request.args.get('to_date', '')
        limit = int(request.args.get('limit', 20))
        
        # Build Gmail query
        gmail_query = 'in:inbox'
        
        if search:
            gmail_query += f' {search}'
        if sender:
            gmail_query += f' from:{sender}'
        if from_date:
            gmail_query += f' after:{from_date}'
        if to_date:
            gmail_query += f' before:{to_date}'
        
        messages = gmail.get_emails(query=gmail_query, max_results=limit)
        
        formatted_emails = []
        for msg in messages:
            message = gmail.get_email_details(msg['id'])
            if message:
                headers = gmail.get_email_headers(message)
                body = gmail.get_email_body(message)
                formatted = format_email_for_frontend(msg['id'], headers, body, message)
                formatted_emails.append(formatted)
        
        return jsonify({
            'status': 'success',
            'data': {
                'emails': formatted_emails,
                'total_count': len(formatted_emails)
            }
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'status': 'error',
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'status': 'error',
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("GMAIL READER API SERVER")
    print("="*60)
    print("\nStarting server on http://localhost:5000")
    print("Frontend (React): http://localhost:3000")
    print("\nAPI Documentation:")
    print("  GET    /api/health                 - Health check")
    print("  GET    /api/gmail/status           - Gmail connection status")
    print("  GET    /api/emails                 - Get emails")
    print("  GET    /api/emails/<id>            - Get email details")
    print("  GET    /api/emails/search          - Search emails")
    print("  POST   /api/emails/export/json     - Export as JSON")
    print("  POST   /api/emails/export/csv      - Export as CSV")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
