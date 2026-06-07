"""
Flask API Server for Gmail Reader
Provides REST endpoints for the React frontend
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
from email_parser import EmailExtractor

from datetime import datetime

import json
import csv
import io
import os
import re


app = Flask(__name__)


# =========================
# CORS
# =========================

if os.getenv('VERCEL'):
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174"
    ]}})


# =========================
# Globals
# =========================

gmail_instance = None
email_cache = {}


# =========================
# Gmail Helper
# =========================

def get_gmail_reader():
    """Initialize Gmail Reader safely"""

    global gmail_instance

    try:
        if gmail_instance is None:
            print("[INFO] Initializing GmailReader...")
            gmail_instance = GmailReader()

        return gmail_instance

    except Exception as e:
        print("[ERROR] GmailReader initialization failed:")
        print(str(e))

        return None


# =========================
# Amount Extraction
# =========================

def extract_amounts(text):
    """Extract monetary values"""

    amounts = []

    patterns = [
        r'(?:[$€£¥₹])\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',
        r'(?:USD|INR|EUR|GBP|AUD|CAD|Rs\.?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',
        r'(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:USD|INR|EUR|GBP|AUD|CAD)',
    ]

    for pattern in patterns:

        matches = re.findall(pattern, text, re.IGNORECASE)

        for match in matches:
            try:
                value = float(match.replace(',', ''))

                if 0.01 <= value <= 10000000:
                    amounts.append(value)

            except:
                pass

    return list(dict.fromkeys(amounts))


# =========================
# Email Formatter
# =========================

def format_email_for_frontend(email_id, headers, body):

    try:

        from_header = headers.get('From', 'Unknown')

        from_name = (
            from_header.split('<')[0].strip()
            if '<' in from_header
            else from_header
        )

        subject = headers.get('Subject', 'No Subject')

        extractor = EmailExtractor(
            subject=subject,
            body=body,
            sender=from_header
        )

        extracted = extractor.extract_all()

        content = (subject + " " + body).lower()

        if any(k in content for k in [
            'invoice', 'payment', 'receipt', 'bank',
            'transaction', 'stripe', 'paypal'
        ]):
            category = 'Payment'

        elif any(k in content for k in [
            'course', 'education', 'assignment',
            'student', 'university'
        ]):
            category = 'Education'

        elif any(k in content for k in [
            'interview', 'job', 'meeting',
            'project', 'career'
        ]):
            category = 'Work'

        elif any(k in content for k in [
            'sale', 'discount', 'offer',
            'coupon', 'deal'
        ]):
            category = 'Promo'

        else:
            category = 'Information'

        amounts = extract_amounts(content)

        return {
            'id': email_id,
            'from': from_header,
            'fromName': from_name,
            'subject': subject,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'time': datetime.now().strftime('%I:%M %p'),
            'category': category,
            'body': body[:1000],
            'fullBody': body,
            'urls': extracted.get('urls', []),
            'emails': extracted.get('email_addresses', []),
            'phones': extracted.get('phone_numbers', []),
            'summary': extracted.get('summary', {}).get('preview', ''),
            'amounts': amounts,
            'totalAmount': sum(amounts)
        }

    except Exception as e:
        print("[ERROR] Email formatting failed:", str(e))
        return None


# =========================
# Health Check
# =========================

@app.route('/api/health', methods=['GET'])
def health_check():

    return jsonify({
        'status': 'success',
        'message': 'API running'
    })


# =========================
# Gmail Status
# =========================

@app.route('/api/gmail/status', methods=['GET'])
def gmail_status():

    try:

        gmail = get_gmail_reader()

        if gmail is None:

            return jsonify({
                'status': 'error',
                'data': {
                    'connected': False,
                    'message': 'Failed to initialize GmailReader'
                }
            }), 500

        profile = gmail.service.users().getProfile(
            userId='me'
        ).execute()

        email_address = profile.get('emailAddress')

        return jsonify({
            'status': 'success',
            'data': {
                'connected': True,
                'email': email_address,
                'lastSync': datetime.now().isoformat()
            }
        })

    except Exception as e:

        print("[ERROR] Gmail status failed:")
        print(str(e))

        return jsonify({
            'status': 'error',
            'data': {
                'connected': False,
                'message': str(e)
            }
        }), 500


# =========================
# Get Emails
# =========================

@app.route('/api/emails', methods=['GET'])
def get_emails():

    try:

        gmail = get_gmail_reader()

        if gmail is None:

            return jsonify({
                'status': 'error',
                'message': 'Gmail connection failed'
            }), 500

        limit = int(request.args.get('limit', 20))

        search = request.args.get('search', '')

        query = 'in:inbox'

        if search:
            query += f' {search}'

        messages = gmail.get_emails(
            query=query,
            max_results=limit
        )

        formatted_emails = []

        for msg in messages:

            try:

                message = gmail.get_email_details(msg['id'])

                if not message:
                    continue

                headers = gmail.get_email_headers(message)

                body = gmail.get_email_body(message)

                formatted = format_email_for_frontend(
                    msg['id'],
                    headers,
                    body
                )

                if formatted:
                    formatted_emails.append(formatted)

            except Exception as e:
                print("[ERROR] Email processing:", str(e))

        return jsonify({
            'status': 'success',
            'data': {
                'emails': formatted_emails,
                'total_count': len(formatted_emails)
            }
        })

    except Exception as e:

        print("[ERROR] get_emails failed:")
        print(str(e))

        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


# =========================
# Email Details
# =========================

@app.route('/api/emails/<email_id>', methods=['GET'])
def get_email_details(email_id):

    try:

        gmail = get_gmail_reader()

        if gmail is None:

            return jsonify({
                'status': 'error',
                'message': 'Gmail connection failed'
            }), 500

        message = gmail.get_email_details(email_id)

        if not message:

            return jsonify({
                'status': 'error',
                'message': 'Email not found'
            }), 404

        headers = gmail.get_email_headers(message)

        body = gmail.get_email_body(message)

        formatted = format_email_for_frontend(
            email_id,
            headers,
            body
        )

        return jsonify({
            'status': 'success',
            'data': formatted
        })

    except Exception as e:

        print("[ERROR] Email detail failed:")
        print(str(e))

        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


# =========================
# Export JSON
# =========================

@app.route('/api/emails/export/json', methods=['POST'])
def export_json():

    try:

        data = request.get_json()

        emails = data.get('emails', [])

        output = io.BytesIO()

        output.write(
            json.dumps(
                emails,
                indent=2
            ).encode('utf-8')
        )

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


# =========================
# Export CSV
# =========================

@app.route('/api/emails/export/csv', methods=['POST'])
def export_csv():

    try:

        data = request.get_json()

        emails = data.get('emails', [])

        output = io.StringIO()

        writer = csv.DictWriter(
            output,
            fieldnames=[
                'from',
                'subject',
                'category',
                'summary'
            ]
        )

        writer.writeheader()

        for email in emails:

            writer.writerow({
                'from': email.get('fromName', ''),
                'subject': email.get('subject', ''),
                'category': email.get('category', ''),
                'summary': email.get('summary', '')
            })

        output.seek(0)

        output_bytes = io.BytesIO(
            output.getvalue().encode('utf-8')
        )

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


# =========================
# Error Handlers
# =========================

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


# =========================
# Main
# =========================

if __name__ == '__main__':

    print("=" * 60)
    print("GMAIL READER API")
    print("=" * 60)

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )