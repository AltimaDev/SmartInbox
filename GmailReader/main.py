"""
Main Application
Connect to Gmail, read emails, and extract content
"""

from gmail_reader import GmailReader
from email_parser import EmailExtractor, EmailParser
import json
from datetime import datetime


def save_email_data(email_data, filename='extracted_emails.json'):
    """Save extracted email data to JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(email_data, f, indent=2, ensure_ascii=False)
        print(f"[OK] Email data saved to {filename}")
    except Exception as e:
        print(f"[ERROR] Error saving data: {str(e)}")


def process_email(gmail_reader, message_id):
    """Process a single email and extract information"""
    message = gmail_reader.get_email_details(message_id)
    
    if not message:
        return None
    
    # Extract headers
    headers = gmail_reader.get_email_headers(message)
    
    # Extract body
    body = gmail_reader.get_email_body(message)
    
    # Use email parser to extract structured info
    extractor = EmailExtractor(
        subject=headers.get('Subject', 'No Subject'),
        body=body,
        sender=headers.get('From', 'Unknown')
    )
    
    extracted_data = extractor.extract_all()
    
    # Add header information
    extracted_data['date'] = headers.get('Date', 'N/A')
    extracted_data['to'] = headers.get('To', 'N/A')
    extracted_data['message_id'] = message_id
    
    return extracted_data


def main():
    """Main application flow"""
    
    print("\n" + "="*60)
    print("GMAIL EMAIL READER & CONTENT EXTRACTOR")
    print("="*60 + "\n")
    
    try:
        # Initialize Gmail Reader
        print("Initializing Gmail connection...")
        gmail = GmailReader()
        
        # Get emails - customize the query as needed
        print("\nFetching emails...")
        
        # Some query examples:
        # 'is:unread' - Unread emails
        # 'from:example@gmail.com' - Emails from specific sender
        # 'subject:important' - Emails with specific subject
        # 'newer_than:7d' - Emails from last 7 days
        
        emails = gmail.get_emails(query='is:unread', max_results=5)
        
        if not emails:
            print("No emails found matching the query.")
            return
        
        # Process and extract content from each email
        all_extracted_data = []
        
        for idx, email in enumerate(emails, 1):
            print(f"\n[{idx}/{len(emails)}] Processing email...")
            email_data = process_email(gmail, email['id'])
            
            if email_data:
                all_extracted_data.append(email_data)
                
                # Display extraction
                extractor = EmailExtractor(
                    subject=email_data['subject'],
                    body=email_data['body'],
                    sender=email_data['sender']
                )
                extractor.print_extraction()
        
        # Save all extracted data
        if all_extracted_data:
            print(f"\n[OK] Successfully processed {len(all_extracted_data)} emails")
            save_email_data(all_extracted_data)
            
            # Display summary
            print("\nSUMMARY:")
            print(f"  - Total Emails: {len(all_extracted_data)}")
            
            promotional_count = sum(1 for e in all_extracted_data if e['is_promotional'])
            alert_count = sum(1 for e in all_extracted_data if e['is_alert'])
            
            print(f"  - Promotional Emails: {promotional_count}")
            print(f"  - Alert Emails: {alert_count}")
            
            total_urls = sum(len(e['urls']) for e in all_extracted_data)
            total_emails = sum(len(e['email_addresses']) for e in all_extracted_data)
            
            print(f"  - Total URLs Found: {total_urls}")
            print(f"  - Total Email Addresses: {total_emails}")
        
    except FileNotFoundError as e:
        print(f"[ERROR] {str(e)}")
        print("\nTo set up Gmail API:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a new project")
        print("3. Enable Gmail API")
        print("4. Create OAuth 2.0 credentials (Desktop application)")
        print("5. Download credentials.json and place in the 'credentials' folder")
        
    except Exception as e:
        print(f"[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
