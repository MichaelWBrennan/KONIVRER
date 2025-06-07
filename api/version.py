"""
Version endpoint for Vercel skew protection
Returns current deployment and version information
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import time

class handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        """Handle HEAD requests for version checking"""
        self.send_version_headers()
    
    def do_GET(self):
        """Handle GET requests for detailed version info"""
        try:
            version_data = self.get_version_data()
            
            self.send_response(200)
            self.send_version_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            self.wfile.write(json.dumps(version_data, indent=2).encode())
            
        except Exception as e:
            self.send_error_response(str(e))
    
    def send_version_headers(self):
        """Send version-related headers"""
        # Get Vercel environment variables
        deployment_id = os.getenv('VERCEL_DEPLOYMENT_ID', 'local-dev')
        git_commit = os.getenv('VERCEL_GIT_COMMIT_SHA', 'unknown')[:8]
        app_version = os.getenv('VITE_APP_VERSION', '1.0.0')
        build_time = os.getenv('VITE_BUILD_TIME', str(int(time.time())))
        
        # Send standard headers
        self.send_response(200)
        
        # Version headers
        self.send_header('X-App-Version', app_version)
        self.send_header('X-Build-Time', build_time)
        self.send_header('X-Git-Commit', git_commit)
        
        # Vercel-specific headers
        self.send_header('X-Vercel-Deployment-Id', deployment_id)
        self.send_header('X-Vercel-Region', os.getenv('VERCEL_REGION', 'unknown'))
        
        # Skew protection headers
        self.send_header('X-Vercel-Skew-Protection', 'enabled')
        self.send_header('X-Vercel-Cache-Status', 'MISS')
        
        # Security headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        self.end_headers()
    
    def get_version_data(self):
        """Get comprehensive version information"""
        return {
            "version": os.getenv('VITE_APP_VERSION', '1.0.0'),
            "buildTime": os.getenv('VITE_BUILD_TIME', str(int(time.time()))),
            "gitCommit": os.getenv('VERCEL_GIT_COMMIT_SHA', 'unknown'),
            "gitBranch": os.getenv('VERCEL_GIT_COMMIT_REF', 'unknown'),
            "deploymentId": os.getenv('VERCEL_DEPLOYMENT_ID', 'local-dev'),
            "deploymentUrl": os.getenv('VERCEL_URL', 'localhost'),
            "region": os.getenv('VERCEL_REGION', 'unknown'),
            "environment": os.getenv('VERCEL_ENV', 'development'),
            "timestamp": int(time.time()),
            "skewProtection": {
                "enabled": True,
                "maxAge": 3600,
                "status": "active"
            },
            "features": {
                "analytics": os.getenv('VITE_ENABLE_ANALYTICS') == 'true',
                "debug": os.getenv('VITE_ENABLE_DEBUG') == 'true'
            }
        }
    
    def send_error_response(self, error_message):
        """Send error response"""
        self.send_response(500)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        error_data = {
            "error": "Version check failed",
            "message": error_message,
            "timestamp": int(time.time())
        }
        
        self.wfile.write(json.dumps(error_data).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Vercel-Skew-Protection')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()