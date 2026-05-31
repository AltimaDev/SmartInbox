"""
Extract Gmail Refresh Token from Local Credentials
Run this to get the GMAIL_REFRESH_TOKEN for Vercel deployment
"""

import pickle
import os

token_file = os.path.join(os.path.dirname(__file__), 'credentials', 'token.pickle')

if not os.path.exists(token_file):
    print("❌ token.pickle not found!")
    print("\nTo generate it, run:")
    print("  python main.py")
    print("\nThis will open a browser for Gmail authentication.")
    exit(1)

try:
    with open(token_file, 'rb') as f:
        creds = pickle.load(f)
    
    if hasattr(creds, 'refresh_token') and creds.refresh_token:
        print("\n✅ Found GMAIL_REFRESH_TOKEN:\n")
        print(creds.refresh_token)
        print("\n" + "="*60)
        print("Copy the token above and add it to Vercel:")
        print("1. https://vercel.com/altimadevs-projects/gmail-reader/settings/environment-variables")
        print("2. Add: GMAIL_REFRESH_TOKEN = [paste token above]")
        print("3. Redeploy: npx vercel --prod")
        print("="*60 + "\n")
    else:
        print("❌ No refresh token found in credentials!")
        print("Make sure you've run: python main.py")
        
except Exception as e:
    print(f"❌ Error reading token: {e}")
    print("\nRun 'python main.py' first to authenticate with Gmail")
