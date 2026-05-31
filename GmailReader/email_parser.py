"""
Email Parser Module
Extract and parse email content
"""

import re
from html.parser import HTMLParser
from urllib.parse import urljoin


class HTMLStripper(HTMLParser):
    """Remove HTML tags from text"""
    SKIP_TAGS = {'style', 'script', 'head'}
    
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.text = []
        self._skip_depth = 0
    
    def handle_starttag(self, tag, attrs):
        if tag.lower() in self.SKIP_TAGS:
            self._skip_depth += 1
    
    def handle_endtag(self, tag):
        if tag.lower() in self.SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1
    
    def handle_data(self, d):
        if self._skip_depth == 0:
            self.text.append(d)
    
    def get_data(self):
        return ''.join(self.text)


class EmailParser:
    """Parse and extract content from emails"""
    
    @staticmethod
    def strip_html(html_content):
        """Remove HTML tags from content"""
        if not html_content:
            return ""
        
        try:
            stripper = HTMLStripper()
            stripper.feed(html_content)
            return stripper.get_data()
        except Exception as e:
            print(f"Error stripping HTML: {str(e)}")
            return html_content
    
    @staticmethod
    def extract_links(text):
        """Extract URLs from email content"""
        url_pattern = r'https?://[^\s\n\r<>"{}|\\^`\[\]]+'
        links = re.findall(url_pattern, text)
        return list(set(links))  # Remove duplicates
    
    @staticmethod
    def extract_email_addresses(text):
        """Extract email addresses from content"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return list(set(emails))  # Remove duplicates
    
    @staticmethod
    def extract_phone_numbers(text):
        """Extract phone numbers from content"""
        # Matches common phone formats
        phone_pattern = r'(?:\+\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})'
        phones = re.findall(phone_pattern, text)
        return phones
    
    @staticmethod
    def clean_text(text):
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = text.strip()
        return text
    
    @staticmethod
    def summarize_email(subject, body, max_length=200):
        """Create a summary of email"""
        summary = {
            'subject': subject.strip() if subject else "No Subject",
            'preview': body[:max_length] + "..." if len(body) > max_length else body,
            'word_count': len(body.split()),
            'char_count': len(body)
        }
        return summary


class EmailExtractor:
    """Extract structured information from emails"""
    
    def __init__(self, subject, body, sender):
        self.subject = subject
        self.body = body
        self.sender = sender
        self.parser = EmailParser()
    
    def extract_all(self):
        """Extract all information from email"""
        clean_body = self.parser.clean_text(self.body)
        # Strip HTML for text-based extraction and summaries
        stripped_body = self.parser.strip_html(self.body)
        clean_stripped = self.parser.clean_text(stripped_body)
        
        extraction = {
            'sender': self.sender,
            'subject': self.subject,
            'body': clean_body,
            'body_html_stripped': stripped_body,
            'urls': self.parser.extract_links(clean_body),
            'email_addresses': self.parser.extract_email_addresses(clean_stripped),
            'phone_numbers': self.parser.extract_phone_numbers(clean_stripped),
            'summary': self.parser.summarize_email(self.subject, clean_stripped),
            'is_promotional': self._is_promotional(),
            'is_alert': self._is_alert(),
        }
        return extraction
    
    def _is_promotional(self):
        """Check if email is promotional"""
        promotional_keywords = [
            'sale', 'discount', 'offer', 'limited time', 'buy now',
            'shop', 'coupon', 'deal', 'promotion', 'exclusive'
        ]
        content = (self.subject + ' ' + self.body).lower()
        return any(keyword in content for keyword in promotional_keywords)
    
    def _is_alert(self):
        """Check if email is an alert/notification"""
        alert_keywords = [
            'alert', 'warning', 'urgent', 'action required',
            'verify', 'confirm', 'suspicious', 'unauthorized'
        ]
        content = (self.subject + ' ' + self.body).lower()
        return any(keyword in content for keyword in alert_keywords)
    
    def print_extraction(self):
        """Pretty print extracted data"""
        data = self.extract_all()
        
        print("\n" + "="*60)
        print("EMAIL EXTRACTION RESULTS")
        print("="*60)
        print(f"Sender: {data['sender']}")
        print(f"Subject: {data['subject']}")
        print(f"\nContent Preview:\n{data['summary']['preview']}")
        
        if data['urls']:
            print(f"\nURLs Found ({len(data['urls'])}):")
            for url in data['urls']:
                print(f"  - {url}")
        
        if data['email_addresses']:
            print(f"\nEmail Addresses Found ({len(data['email_addresses'])}):")
            for email in data['email_addresses']:
                print(f"  - {email}")
        
        if data['phone_numbers']:
            print(f"\nPhone Numbers Found ({len(data['phone_numbers'])}):")
            for phone in data['phone_numbers']:
                print(f"  - {'-'.join(phone)}")
        
        print(f"\nStats:")
        print(f"  - Word Count: {data['summary']['word_count']}")
        print(f"  - Character Count: {data['summary']['char_count']}")
        print(f"  - Is Promotional: {data['is_promotional']}")
        print(f"  - Is Alert: {data['is_alert']}")
        print("="*60 + "\n")
        
        return data
