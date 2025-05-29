from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import re
import html

class handler(BaseHTTPRequestHandler):
    def _send_security_headers(self):
        """Add security headers to response"""
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        self.send_header('Content-Security-Policy', "default-src 'self'")
        
    def _validate_input(self, value, max_length=100):
        """Validate and sanitize input"""
        if not value:
            return None
        
        # Remove any HTML/script tags
        value = html.escape(value)
        
        # Limit length
        if len(value) > max_length:
            value = value[:max_length]
            
        # Only allow alphanumeric, spaces, and basic punctuation
        if not re.match(r'^[a-zA-Z0-9\s\-_.,!?]+$', value):
            return None
            
        return value.strip()

    def do_GET(self):
        try:
            # Parse query parameters
            parsed_path = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_path.query)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self._send_security_headers()
            self.end_headers()
            
            # Sample card data
            cards = [
                {
                    'id': 1,
                    'name': 'Lightning Strike',
                    'cost': 3,
                    'type': 'Spell',
                    'rarity': 'Common',
                    'description': 'Deal 3 damage to any target.'
                },
                {
                    'id': 2,
                    'name': 'Forest Guardian',
                    'cost': 5,
                    'type': 'Creature',
                    'rarity': 'Rare',
                    'description': 'A mighty protector of the ancient woods.'
                }
            ]
        
            # Filter by name if provided (with input validation)
            name_filter = query_params.get('name', [None])[0]
            if name_filter:
                name_filter = self._validate_input(name_filter, 50)
                if name_filter:
                    cards = [card for card in cards if name_filter.lower() in card['name'].lower()]
                else:
                    # Invalid input - return error
                    response = {
                        'error': 'Invalid name filter',
                        'status': 'error'
                    }
                    self.wfile.write(json.dumps(response).encode())
                    return
        
            response = {
                'cards': cards,
                'total': len(cards),
                'status': 'success'
            }
            
            self.wfile.write(json.dumps(response).encode())
            return
            
        except Exception as e:
            # Log error and return safe error message
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self._send_security_headers()
            self.end_headers()
            
            error_response = {
                'error': 'Internal server error',
                'status': 'error'
            }
            self.wfile.write(json.dumps(error_response).encode())
            return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self._send_security_headers()
        self.end_headers()
        return