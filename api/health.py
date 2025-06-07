from http.server import BaseHTTPRequestHandler
import json
import sys
import platform
import os
import time

class handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        """Handle HEAD requests for skew protection checks"""
        self.send_response(200)
        self.send_skew_headers()
        self.end_headers()
    
    def do_GET(self):
        self.send_response(200)
        self.send_skew_headers()
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Vercel-Skew-Protection')
        self.end_headers()
        
        response = {
            'status': 'healthy',
            'message': 'Python API is running successfully on Vercel',
            'python_version': sys.version,
            'platform': platform.platform(),
            'timestamp': str(__import__('datetime').datetime.now()),
            'api_version': '1.0.0',
            'deployment': {
                'id': os.getenv('VERCEL_DEPLOYMENT_ID', 'local-dev'),
                'region': os.getenv('VERCEL_REGION', 'unknown'),
                'environment': os.getenv('VERCEL_ENV', 'development')
            },
            'skewProtection': {
                'enabled': True,
                'maxAge': 3600
            }
        }
        
        self.wfile.write(json.dumps(response, indent=2).encode())
    
    def send_skew_headers(self):
        """Send Vercel skew protection headers"""
        # Version and deployment info
        app_version = os.getenv('VITE_APP_VERSION', '1.0.0')
        deployment_id = os.getenv('VERCEL_DEPLOYMENT_ID', 'local-dev')
        build_time = os.getenv('VITE_BUILD_TIME', str(int(time.time())))
        
        self.send_header('X-App-Version', app_version)
        self.send_header('X-Vercel-Deployment-Id', deployment_id)
        self.send_header('X-Build-Time', build_time)
        self.send_header('X-Vercel-Skew-Protection', 'enabled')
        self.send_header('Cache-Control', 'no-cache, max-age=0')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return