from http.server import BaseHTTPRequestHandler
import json
import sys
import platform

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        response = {
            'status': 'healthy',
            'message': 'Python API is running successfully on Vercel',
            'python_version': sys.version,
            'platform': platform.platform(),
            'timestamp': str(__import__('datetime').datetime.now()),
            'api_version': '1.0.0'
        }
        
        self.wfile.write(json.dumps(response, indent=2).encode())
        return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return