#!/usr/bin/env python3
"""
Script to process the Green Dream cards from the spreadsheet and add them to the database.
"""

import json
import re

# Symbol mappings from the spreadsheet
SYMBOL_MAPPINGS = {
    '✡︎⃝': '✡︎⃝',  # Quintessence
    '⬢': '⬢',      # Brilliance  
    '🜁': '🜁',      # Gust
    '🜂': '🜂',      # Inferno
    '🜃': '🜃',      # Steadfast
    '🜄': '🜄',      # Submerged
    '▢': '▢',      # Void
    '∇': '∇',      # (appears to be another element symbol)
}

# Keyword mappings
KEYWORD_MAPPINGS = {
    'BRILLIANCE': 'Brilliance',
    'GUST': 'Gust', 
    'INFERNO': 'Inferno',
    'STEADFAST': 'Steadfast',
    'SUBMERGED': 'Submerged',
    'VOID': 'Void',
    'AMALGAM': 'Amalgam',
    'QUINTESSANCE': 'Quintessence'
}

def parse_elements(cost_columns):
    """Parse element symbols from cost columns"""
    elements = []
    for cost in cost_columns:
        if cost and cost.strip():
            # Clean up the cost string and extract symbols
            cost = cost.strip()
            if cost in SYMBOL_MAPPINGS:
                elements.append(SYMBOL_MAPPINGS[cost])
    return elements

def parse_keywords(familiar_text):
    """Parse keywords from familiar text"""
    if not familiar_text:
        return []
    
    keywords = []
    text_upper = familiar_text.upper()
    
    for keyword_upper, keyword_proper in KEYWORD_MAPPINGS.items():
        if keyword_upper in text_upper:
            keywords.append(keyword_proper)
    
    return keywords

def create_card_id(name, collector_number):
    """Create a unique card ID"""
    # Clean name for ID
    clean_name = re.sub(r'[^a-zA-Z0-9]', '', name.lower())
    return f"gd_{collector_number:03d}_{clean_name}"

# Raw card data from spreadsheet (processed from the fetch results)
raw_cards = [
    {
        "name": "ΦIVE ELEMENT ΦLAG",
        "quantity": 6,
        "costs": ["", "", "", "", "", ""],
        "type": "ΦLAG",
        "flavor": "",
        "set_symbol": "FLAG",
        "familiar_text": "CIRCLE 5 OF THE 6 ELEMENTS ABOVE. YOUR DECK MAY INCLUDE CARDS WITH ANY COMBINATION OF THOSE 5. YOUR DECK HAS +1 DAMAGE AGAINST OPPOSING ELEMENTS.",
        "collector_number": "",
        "set_total": ""
    },
    {
        "name": "ABISS",
        "quantity": 1,
        "costs": ["✡︎⃝", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Truth shines brilliantly through all veils, revealing herself despite attempts to hide her from view. ~The Green Dream",
        "set_symbol": "FM-🜠",
        "familiar_text": "VOID, SUBMERGED",
        "collector_number": "1/63",
        "set_total": "63"
    },
    {
        "name": "ANGEL",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢"],
        "type": "ELEMENTAL",
        "flavor": "In deepest sleep, I beheld a 15-foot statue of a perfectly proportioned old man. ~The Green Dream",
        "set_symbol": "FM-🜠",
        "familiar_text": "BRILLIANCE",
        "collector_number": "2/63",
        "set_total": "63"
    },
    {
        "name": "AZOΘ",
        "quantity": 1,
        "costs": ["✡︎⃝"],
        "type": "ELEMENTAL",
        "flavor": "His silver hair bore dazzling turquoise and carbuncles, their light too bright to bear. ~The Green Dream",
        "set_symbol": "FM-☉",
        "familiar_text": "QUINTESSANCE",
        "collector_number": "3/63",
        "set_total": "63"
    },
    {
        "name": "BRIΓT DVST",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢", "🜁", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "His form had golden lips, oriental pearl teeth, and a body of brilliant ruby. ~The Green Dream",
        "set_symbol": "FM-🜠",
        "familiar_text": "BRILLIANCE, GUST, STEADFAST",
        "collector_number": "4/63",
        "set_total": "63"
    },
    {
        "name": "BRIΓT FVLGVRITE",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "His left foot rested upon the Earth Globe, which supported him. ~The Green Dream",
        "set_symbol": "FM-☽",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, STEADFAST",
        "collector_number": "5/63",
        "set_total": "63"
    },
    {
        "name": "FROST",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢", "🜁", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "His right fingertip held a celestial globe aloft; his left hand gripped a diamond key. ~The Green Dream",
        "set_symbol": "FM-🜠",
        "familiar_text": "BRILLIANCE, GUST, SUBMERGED",
        "collector_number": "6/63",
        "set_total": "63"
    },
    {
        "name": "BRIΓT THVNDERSNOVV",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Approaching, he said: 'I am the Genius of the Wise. Follow me without fear.' ~The Green Dream",
        "set_symbol": "FM-☽",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, SUBMERGED",
        "collector_number": "7/63",
        "set_total": "63"
    },
    {
        "name": "BRIΓT LAVA",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢", "🜂", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Gripping my hair with his key hand, he carried me through regions of Air, Fire, and Planetary Heavens. ~The Green Dream",
        "set_symbol": "FM-🜠",
        "familiar_text": "BRILLIANCE, INFERNO, STEADFAST",
        "collector_number": "8/63",
        "set_total": "63"
    },
    {
        "name": "BRIΓT LIΓTNING",
        "quantity": 1,
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂"],
        "type": "ELEMENTAL",
        "flavor": "After wrapping me in a whirlwind, he vanished. I found myself on an isle in a sea of blood. ~The Green Dream",
        "set_symbol": "FM-🜠",
        "familiar_text": "BRILLIANCE, GUST, INFERNO",
        "collector_number": "9/63",
        "set_total": "63"
    }
]

# Continue with more cards... (I'll add them in batches)

def process_cards():
    """Process the raw card data into proper JSON format"""
    processed_cards = []
    
    for i, card_data in enumerate(raw_cards):
        if card_data["name"] == "ΦIVE ELEMENT ΦLAG":
            # Skip the flag card for now as it's a special type
            continue
            
        # Extract collector number
        collector_num = card_data["collector_number"].split("/")[0] if "/" in card_data["collector_number"] else str(i+1)
        
        # Create card entry
        card = {
            "id": create_card_id(card_data["name"], int(collector_num)),
            "name": card_data["name"],
            "elements": [cost for cost in card_data["costs"] if cost and cost.strip()],
            "keywords": parse_keywords(card_data["familiar_text"]),
            "cost": len([cost for cost in card_data["costs"] if cost and cost.strip()]),
            "power": 0,  # Default, would need to be specified
            "rarity": "common",  # Default, would need to be specified
            "type": "Familiar",
            "class": card_data["type"],
            "talents": parse_keywords(card_data["familiar_text"]),  # Using keywords as talents for now
            "set": "The Green Dream",
            "setNumber": card_data["collector_number"],
            "artist": "Unknown",
            "flavor": card_data["flavor"],
            "text": card_data["familiar_text"],
            "image": f"/images/cards/{card_data['name'].lower().replace(' ', '-').replace('γ', 'g').replace('θ', 'th').replace('φ', 'ph')}.jpg"
        }
        
        processed_cards.append(card)
    
    return processed_cards

if __name__ == "__main__":
    cards = process_cards()
    print(json.dumps(cards, indent=2))