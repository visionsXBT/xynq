import os
import tweepy
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

"""
Twitter OAuth 2.0 Setup Helper
Run this once to get your access token for posting tweets
"""

# Global variable to store the authorization response
auth_response = None

class OAuthCallbackHandler(BaseHTTPRequestHandler):
    """Handle OAuth callback"""
    def do_GET(self):
        global auth_response
        auth_response = self.path
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html = """
        <html>
        <head><title>Authorization Successful</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>✅ Authorization Successful!</h1>
            <p>You can close this window and return to the terminal.</p>
        </body>
        </html>
        """
        self.wfile.write(html.encode())
    
    def log_message(self, format, *args):
        # Suppress server logs
        pass

def setup_oauth2():
    print("="*60)
    print("TWITTER OAUTH 2.0 SETUP")
    print("="*60)
    
    # Get credentials from environment or prompt
    client_id = os.environ.get("TWITTER_CLIENT_ID")
    client_secret = os.environ.get("TWITTER_CLIENT_SECRET")
    
    if not client_id:
        client_id = input("\nEnter your Twitter Client ID: ").strip()
    else:
        print(f"\n✓ Using Client ID from environment: {client_id[:10]}...")
    
    if not client_secret:
        client_secret = input("Enter your Twitter Client Secret: ").strip()
    else:
        print(f"✓ Using Client Secret from environment")
    
    if not client_id or not client_secret:
        print("\n❌ Error: Client ID and Secret are required!")
        print("\n📋 To get these credentials:")
        print("1. Go to https://developer.twitter.com/en/portal/dashboard")
        print("2. Select your app (or create a new one)")
        print("3. Click on 'User authentication settings' → 'Set up'")
        print("4. Configure OAuth 2.0:")
        print("   - Type of App: 'Web App, Automated App or Bot'")
        print("   - Callback URI: http://localhost:8080")
        print("   - App permissions: 'Read and Write'")
        print("5. Copy your Client ID and Client Secret")
        return
    
    print("\n" + "="*60)
    print("CHECKING YOUR TWITTER APP CONFIGURATION")
    print("="*60)
    print("\n⚠️  Before continuing, verify your app settings:")
    print("1. App Type: 'Web App, Automated App or Bot'")
    print("2. Callback URI: http://localhost:8080 (exactly)")
    print("3. App Permissions: 'Read and Write'")
    print("4. Scopes enabled: tweet.read, tweet.write, users.read, offline.access")
    
    input("\n✓ Press ENTER when you've verified these settings...")
    
    try:
        # Start local server to receive callback
        print("\n🚀 Starting local server on http://localhost:8080...")
        server = HTTPServer(('localhost', 8080), OAuthCallbackHandler)
        server_thread = threading.Thread(target=server.handle_request)
        server_thread.daemon = True
        server_thread.start()
        
        # Create OAuth2UserHandler
        oauth2_user_handler = tweepy.OAuth2UserHandler(
            client_id=client_id,
            redirect_uri="http://localhost:8080",
            scope=["tweet.read", "tweet.write", "users.read", "offline.access"],
            client_secret=client_secret
        )
        
        # Get authorization URL
        auth_url = oauth2_user_handler.get_authorization_url()
        
        print("\n" + "="*60)
        print("STEP: AUTHORIZE THE APPLICATION")
        print("="*60)
        print(f"\n🔗 Open this URL in your browser:\n\n{auth_url}\n")
        print("⏳ Waiting for authorization...")
        print("(The browser will automatically redirect after you authorize)")
        
        # Wait for callback
        server_thread.join(timeout=120)  # Wait up to 2 minutes
        
        if auth_response is None:
            print("\n❌ Timeout: No authorization received within 2 minutes.")
            print("Please try again and complete the authorization faster.")
            server.server_close()
            return
        
        server.server_close()
        
        # Fetch the token
        print("\n📥 Exchanging authorization code for tokens...")
        access_token = oauth2_user_handler.fetch_token(
            f"http://localhost:8080{auth_response}"
        )
        
        print("\n" + "="*60)
        print("✅ SUCCESS! YOUR TOKENS:")
        print("="*60)
        print(f"\nAccess Token: {access_token['access_token'][:30]}...")
        if 'refresh_token' in access_token:
            print(f"Refresh Token: {access_token['refresh_token'][:30]}...")
        else:
            print("⚠️  No refresh token received. Make sure 'offline.access' scope is enabled.")
        
        print("\n" + "="*60)
        print("💾 SAVE THESE ENVIRONMENT VARIABLES")
        print("="*60)
        print("\nRun these commands in your terminal:\n")
        print(f'setx TWITTER_CLIENT_ID "{client_id}"')
        print(f'setx TWITTER_CLIENT_SECRET "{client_secret}"')
        print(f'setx TWITTER_ACCESS_TOKEN "{access_token["access_token"]}"')
        if 'refresh_token' in access_token:
            print(f'setx TWITTER_REFRESH_TOKEN "{access_token["refresh_token"]}"')
        
        print("\n⚠️  IMPORTANT: Restart your terminal after running these commands!")
        print("="*60)
        
        # Test the token
        print("\n🧪 Testing token...")
        client = tweepy.Client(bearer_token=access_token['access_token'])
        me = client.get_me()
        print(f"✅ Authenticated as: @{me.data.username}")
        print(f"✅ Account ID: {me.data.id}")
        
    except tweepy.TweepyException as e:
        print(f"\n❌ Twitter API Error: {e}")
        print("\n🔍 Common fixes:")
        print("1. Make sure your Callback URI is EXACTLY: http://localhost:8080")
        print("2. Check that your app has 'Read and Write' permissions")
        print("3. Verify OAuth 2.0 is enabled in your app settings")
        print("4. Try regenerating your Client Secret in the developer portal")
    except Exception as e:
        print(f"\n❌ Error during OAuth flow: {e}")
        print("\n🔍 Troubleshooting:")
        print("1. Check your internet connection")
        print("2. Make sure port 8080 is not being used by another application")
        print("3. Verify your Client ID and Secret are correct")

if __name__ == "__main__":
    setup_oauth2()