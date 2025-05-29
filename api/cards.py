from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
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
        
        # Filter by name if provided
        name_filter = query_params.get('name', [None])[0]
        if name_filter:
            cards = [card for card in cards if name_filter.lower() in card['name'].lower()]
        
        response = {
            'cards': cards,
            'total': len(cards),
            'status': 'success'
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return