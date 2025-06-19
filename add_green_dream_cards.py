#!/usr/bin/env python3
"""
Script to add all Green Dream cards from the spreadsheet to the KONIVRER database.
"""

import json
import re

def clean_name_for_id(name):
    """Clean card name for use in ID"""
    # Replace special characters
    clean = name.replace('Γ', 'G').replace('Θ', 'TH').replace('Φ', 'PH')
    clean = re.sub(r'[^a-zA-Z0-9]', '_', clean).lower()
    clean = re.sub(r'_+', '_', clean).strip('_')
    return clean

def parse_keywords(text):
    """Extract keywords from familiar text"""
    if not text:
        return []
    
    keywords = []
    text_upper = text.upper()
    
    keyword_map = {
        'BRILLIANCE': 'Brilliance',
        'GUST': 'Gust',
        'INFERNO': 'Inferno', 
        'STEADFAST': 'Steadfast',
        'SUBMERGED': 'Submerged',
        'VOID': 'Void',
        'AMALGAM': 'Amalgam',
        'QUINTESSANCE': 'Quintessence'
    }
    
    for keyword_upper, keyword_proper in keyword_map.items():
        if keyword_upper in text_upper:
            keywords.append(keyword_proper)
    
    return keywords

def parse_elements(costs):
    """Parse element symbols from cost array"""
    elements = []
    for cost in costs:
        if cost and cost.strip():
            elements.append(cost.strip())
    return elements

# All Green Dream cards data extracted from spreadsheet
green_dream_cards = [
    {
        "name": "ABISS",
        "costs": ["✡︎⃝", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Truth shines brilliantly through all veils, revealing herself despite attempts to hide her from view. ~The Green Dream",
        "familiar_text": "VOID, SUBMERGED",
        "collector_number": "1/63"
    },
    {
        "name": "ANGEL", 
        "costs": ["✡︎⃝", "⬢"],
        "type": "ELEMENTAL",
        "flavor": "In deepest sleep, I beheld a 15-foot statue of a perfectly proportioned old man. ~The Green Dream",
        "familiar_text": "BRILLIANCE",
        "collector_number": "2/63"
    },
    {
        "name": "AZOΘ",
        "costs": ["✡︎⃝"],
        "type": "ELEMENTAL", 
        "flavor": "His silver hair bore dazzling turquoise and carbuncles, their light too bright to bear. ~The Green Dream",
        "familiar_text": "QUINTESSANCE",
        "collector_number": "3/63"
    },
    {
        "name": "BRIΓT DVST",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "His form had golden lips, oriental pearl teeth, and a body of brilliant ruby. ~The Green Dream", 
        "familiar_text": "BRILLIANCE, GUST, STEADFAST",
        "collector_number": "4/63"
    },
    {
        "name": "BRIΓT FVLGVRITE",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "His left foot rested upon the Earth Globe, which supported him. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, STEADFAST", 
        "collector_number": "5/63"
    },
    {
        "name": "FROST",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "His right fingertip held a celestial globe aloft; his left hand gripped a diamond key. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, SUBMERGED",
        "collector_number": "6/63"
    },
    {
        "name": "BRIΓT THVNDERSNOVV",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Approaching, he said: 'I am the Genius of the Wise. Follow me without fear.' ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, SUBMERGED",
        "collector_number": "7/63"
    },
    {
        "name": "BRIΓT LAVA",
        "costs": ["✡︎⃝", "⬢", "🜂", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Gripping my hair with his key hand, he carried me through regions of Air, Fire, and Planetary Heavens. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, STEADFAST",
        "collector_number": "8/63"
    },
    {
        "name": "BRIΓT LIΓTNING",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂"],
        "type": "ELEMENTAL",
        "flavor": "After wrapping me in a whirlwind, he vanished. I found myself on an isle in a sea of blood. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO",
        "collector_number": "9/63"
    },
    {
        "name": "BRIΓT LAHAR",
        "costs": ["✡︎⃝", "⬢", "🜂", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Walking the beach of this distant land, I noticed the blood sea was warm and vital. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, STEADFAST, SUBMERGED",
        "collector_number": "10/63"
    },
    {
        "name": "BRIΓT MVD",
        "costs": ["✡︎⃝", "⬢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "A constant breeze stirred the sea, maintaining its warmth and causing the isle to pulse gently. ~The Green Dream",
        "familiar_text": "BRILLIANCE, STEADFAST, SUBMERGED",
        "collector_number": "11/63"
    },
    {
        "name": "BRIΓT STEAM",
        "costs": ["✡︎⃝", "⬢", "🜂", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Lost in wonder at these marvels, I saw people approaching. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, SUBMERGED",
        "collector_number": "12/63"
    },
    {
        "name": "BRIΓT PERMAΦROST",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "I hid under jasmine, but its scent made me sleep. They found and caught me. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, STEADFAST, SUBMERGED",
        "collector_number": "13/63"
    },
    {
        "name": "DARK DVST",
        "costs": ["✡︎⃝", "🜁", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Their leader demanded why I dared come from Netherlands to their high realm. ~The Green Dream",
        "familiar_text": "GUST, VOID, STEADFAST",
        "collector_number": "14/63"
    },
    {
        "name": "DARK FVLGVRITE",
        "costs": ["✡︎⃝", "🜁", "🜂", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "After I explained, he welcomed me as one guided by their mighty Genie. ~The Green Dream",
        "familiar_text": "GUST, INFERNO, VOID, STEADFAST",
        "collector_number": "15/63"
    },
    {
        "name": "DARK ICE",
        "costs": ["✡︎⃝", "🜁", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "They greeted me by lying back, turning over, then rising - their custom. ~The Green Dream",
        "familiar_text": "GUST, VOID, SUBMERGED",
        "collector_number": "16/63"
    },
    {
        "name": "DARK THVNDERSNOVV",
        "costs": ["✡︎⃝", "🜁", "🜂", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "I returned their greeting in my own way. ~The Green Dream",
        "familiar_text": "GUST, INFERNO, VOID, SUBMERGED",
        "collector_number": "17/63"
    },
    {
        "name": "DARK LAVA",
        "costs": ["✡︎⃝", "🜂", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "He offered to present me to Emperor Hagacestaur. ~The Green Dream",
        "familiar_text": "INFERNO, VOID, STEADFAST",
        "collector_number": "18/63"
    },
    {
        "name": "DARK LIΓTNING",
        "costs": ["✡︎⃝", "🜁", "🜂", "▢"],
        "type": "ELEMENTAL",
        "flavor": "He apologized for lacking transport to town, a league away. ~The Green Dream",
        "familiar_text": "GUST, INFERNO, VOID",
        "collector_number": "19/63"
    },
    {
        "name": "FOG",
        "costs": ["✡︎⃝", "🜁", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "He told of Hagacestaur's seven realms, ruling from the central one. ~The Green Dream",
        "familiar_text": "GUST, VOID, STEADFAST, SUBMERGED",
        "collector_number": "20/63"
    },
    {
        "name": "DARK LAHAR",
        "costs": ["✡︎⃝", "🜂", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "He saw me carefully avoiding the countless flowers growing on the paths. ~The Green Dream",
        "familiar_text": "INFERNO, VOID, STEADFAST, SUBMERGED",
        "collector_number": "21/63"
    },
    {
        "name": "EMBERS",
        "costs": ["✡︎⃝", "🜂", "▢"],
        "type": "ELEMENTAL",
        "flavor": "Smiling, he asked if I feared harming the blooms. ~The Green Dream",
        "familiar_text": "INFERNO, VOID",
        "collector_number": "22/63"
    },
    {
        "name": "SMOKE",
        "costs": ["✡︎⃝", "🜂", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "I explained flowers were rare at home; I hated trampling them. ~The Green Dream",
        "familiar_text": "INFERNO, VOID, SUBMERGED",
        "collector_number": "23/63"
    },
    {
        "name": "DARK TIΦOON",
        "costs": ["✡︎⃝", "🜁", "🜂", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Seeing only flowers and fruits, I asked where they grew corn. ~The Green Dream",
        "familiar_text": "",
        "collector_number": "24/63"
    },
    {
        "name": "DVST",
        "costs": ["✡︎⃝", "🜁", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "They send excess corn to Netherlands, keep some for beasts. None planted. ~The Green Dream",
        "familiar_text": "GUST, STEADFAST",
        "collector_number": "25/63"
    },
    {
        "name": "ASH",
        "costs": ["✡︎⃝", "🜁", "🜂", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Their bread is made from flowers, kneaded with dew and baked in sunlight. ~The Green Dream",
        "familiar_text": "GUST, INFERNO, STEADFAST",
        "collector_number": "26/63"
    },
    {
        "name": "GEODE",
        "costs": ["✡︎⃝", "⬢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "He stopped me eating pears, saying they were beast-food, but I tried anyway. ~The Green Dream",
        "familiar_text": "BRILLIANCE, STEADFAST",
        "collector_number": "27/63"
    },
    {
        "name": "GNOME",
        "costs": ["✡︎⃝", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "The taste was remarkable. ~The Green Dream",
        "familiar_text": "STEADFAST",
        "collector_number": "28/63"
    },
    {
        "name": "ICE",
        "costs": ["✡︎⃝", "🜁", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Their peaches, melons, and figs surpassed all fruits of Provence, Italy, and Greece. ~The Green Dream",
        "familiar_text": "GUST, SUBMERGED",
        "collector_number": "29/63"
    },
    {
        "name": "STORM",
        "costs": ["✡︎⃝", "🜁", "🜂", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "He swore all fruits grew wild; they ate only these with their bread. ~The Green Dream",
        "familiar_text": "GUST, INFERNO, SUBMERGED",
        "collector_number": "30/63"
    },
    {
        "name": "RAINBOVV",
        "costs": ["✡︎⃝", "⬢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "I asked how they preserved winter food. ~The Green Dream",
        "familiar_text": "BRILLIANCE, SUBMERGED",
        "collector_number": "31/63"
    },
    {
        "name": "MAGMA",
        "costs": ["✡︎⃝", "🜂", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "No winter exists here - only spring, summer, and autumn holding their essence. ~The Green Dream",
        "familiar_text": "INFERNO, STEADFAST",
        "collector_number": "32/63"
    },
    {
        "name": "LIGHT TIΦOON",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Grapes and pomegranates were their finest fruits. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, STEADFAST, SUBMERGED",
        "collector_number": "33/63"
    },
    {
        "name": "LIΓTNING",
        "costs": ["✡︎⃝", "🜁", "🜂"],
        "type": "ELEMENTAL",
        "flavor": "He was shocked to learn we eat meat and fish. ~The Green Dream",
        "familiar_text": "GUST, INFERNO",
        "collector_number": "34/63"
    },
    {
        "name": "MIASMA",
        "costs": ["✡︎⃝", "🜁", "▢"],
        "type": "ELEMENTAL",
        "flavor": "He claimed such food dulled our minds. ~The Green Dream",
        "familiar_text": "GUST, VOID",
        "collector_number": "35/63"
    },
    {
        "name": "LAHAR",
        "costs": ["✡︎⃝", "🜂", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "I listened, enchanted by these sweet tales. ~The Green Dream",
        "familiar_text": "INFERNO, STEADFAST, SUBMERGED",
        "collector_number": "36/63"
    },
    {
        "name": "MVD",
        "costs": ["✡︎⃝", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "They bid me look at their approaching city. ~The Green Dream",
        "familiar_text": "STEADFAST, SUBMERGED",
        "collector_number": "37/63"
    },
    {
        "name": "NEKROSIS",
        "costs": ["✡︎⃝", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "The city's brightness blinded me; my guides laughed. ~The Green Dream",
        "familiar_text": "VOID, STEADFAST",
        "collector_number": "38/63"
    },
    {
        "name": "ΣADE",
        "costs": ["✡︎⃝", "▢"],
        "type": "ELEMENTAL",
        "flavor": "Their mockery hurt more than my blindness. ~The Green Dream",
        "familiar_text": "VOID",
        "collector_number": "39/63"
    },
    {
        "name": "SOLAR",
        "costs": ["✡︎⃝", "⬢", "🜂"],
        "type": "ELEMENTAL",
        "flavor": "He soothed me, promising sight would return, and rubbed herbs on my eyes. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO",
        "collector_number": "40/63"
    },
    {
        "name": "SALAMANDER",
        "costs": ["✡︎⃝", "🜂"],
        "type": "ELEMENTAL",
        "flavor": "Through crystal walls I saw the eternal daylight city. ~The Green Dream",
        "familiar_text": "INFERNO",
        "collector_number": "41/63"
    },
    {
        "name": "SILΦ",
        "costs": ["✡︎⃝", "🜁"],
        "type": "ELEMENTAL",
        "flavor": "They showed me the houses through transparent walls. ~The Green Dream",
        "familiar_text": "GUST",
        "collector_number": "42/63"
    },
    {
        "name": "AVRORA",
        "costs": ["✡︎⃝", "⬢", "🜁"],
        "type": "ELEMENTAL",
        "flavor": "Each house shared one design: three apartments with many chambers. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST",
        "collector_number": "43/63"
    },
    {
        "name": "STEAM",
        "costs": ["✡︎⃝", "🜂", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "First hall had gold-trimmed damask walls. ~The Green Dream",
        "familiar_text": "INFERNO, SUBMERGED",
        "collector_number": "44/63"
    },
    {
        "name": "TAR",
        "costs": ["✡︎⃝", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "More rooms followed, adorned with jewels. ~The Green Dream",
        "familiar_text": "VOID, STEADFAST, SUBMERGED",
        "collector_number": "45/63"
    },
    {
        "name": "TIΦOON",
        "costs": ["✡︎⃝", "🜁", "🜂", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "One chamber gleamed in jet-black velvet. ~The Green Dream",
        "familiar_text": "GUST, INFERNO, STEADFAST, SUBMERGED",
        "collector_number": "46/63"
    },
    {
        "name": "VNDINE",
        "costs": ["✡︎⃝", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Second apartment shone with pearl-white walls. ~The Green Dream",
        "familiar_text": "SUBMERGED",
        "collector_number": "47/63"
    },
    {
        "name": "XAOS",
        "costs": ["✡︎⃝", "⬢", "▢"],
        "type": "ELEMENTAL",
        "flavor": "Rooms in blue, violet, yellow, and scarlet followed. ~The Green Dream",
        "familiar_text": "BRILLIANCE, VOID",
        "collector_number": "48/63"
    },
    {
        "name": "XAOS DVST",
        "costs": ["✡︎⃝", "⬢", "🜁", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Third apartment glowed in purple and gold. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, VOID, STEADFAST",
        "collector_number": "49/63"
    },
    {
        "name": "XAOS FVLGVRITE",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Masters dwelt hidden in inner chambers. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, VOID, STEADFAST",
        "collector_number": "50/63"
    },
    {
        "name": "XAOS GNOME",
        "costs": ["✡︎⃝", "⬢", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Connecting rooms wore silk of varied hues. ~The Green Dream",
        "familiar_text": "BRILLIANCE, VOID, STEADFAST",
        "collector_number": "51/63"
    },
    {
        "name": "XAOS ICE",
        "costs": ["✡︎⃝", "⬢", "🜁", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Fourth room held pure concentrated sunlight. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, VOID, SUBMERGED",
        "collector_number": "52/63"
    },
    {
        "name": "XAOS THVNDERSNOVV",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "They explained their marriage customs. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, VOID, SUBMERGED",
        "collector_number": "53/63"
    },
    {
        "name": "XAOS LAVA",
        "costs": ["✡︎⃝", "⬢", "🜂", "▢", "🜃"],
        "type": "ELEMENTAL",
        "flavor": "Hagacestaur matches pure maids with strong old men. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, VOID, STEADFAST",
        "collector_number": "54/63"
    },
    {
        "name": "XAOS LIΓTNING",
        "costs": ["✡︎⃝", "⬢", "🜁", "🜂", "▢"],
        "type": "ELEMENTAL",
        "flavor": "After purification, they join hands in ceremony. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, INFERNO, VOID",
        "collector_number": "55/63"
    },
    {
        "name": "XAOS MIST",
        "costs": ["✡︎⃝", "⬢", "🜂", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Nine months sealed away, they create fine furnishings. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, VOID, STEADFAST, SUBMERGED",
        "collector_number": "56/63"
    },
    {
        "name": "XAOS MVD",
        "costs": ["✡︎⃝", "⬢", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "They emerge as one body, one soul, mighty on Earth. ~The Green Dream",
        "familiar_text": "BRILLIANCE, VOID, STEADFAST, SUBMERGED",
        "collector_number": "57/63"
    },
    {
        "name": "XAOS SALAMANDER",
        "costs": ["✡︎⃝", "⬢", "🜂", "▢"],
        "type": "ELEMENTAL",
        "flavor": "They help convert the wicked throughout seven realms. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, VOID",
        "collector_number": "58/63"
    },
    {
        "name": "XAOS SILΦ",
        "costs": ["✡︎⃝", "⬢", "🜁", "▢"],
        "type": "ELEMENTAL",
        "flavor": "Four ancient statues await: Séganiségéde centered, three goddesses around. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, VOID",
        "collector_number": "59/63"
    },
    {
        "name": "XAOS STEAM",
        "costs": ["✡︎⃝", "⬢", "🜂", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "I would see the ancient statues: Séganiségéde at center with his mighty presence, brought me to this isle. ~The Green Dream",
        "familiar_text": "BRILLIANCE, INFERNO, VOID, SUBMERGED",
        "collector_number": "60/63"
    },
    {
        "name": "XAOS VNDINE",
        "costs": ["✡︎⃝", "⬢", "▢", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Three goddesses formed a triangle: Ellugaté, Linémalore, and Tripsarécopsem, ancient as the world. ~The Green Dream",
        "familiar_text": "BRILLIANCE, VOID, SUBMERGED",
        "collector_number": "61/63"
    },
    {
        "name": "XAOS PERMAΦROST",
        "costs": ["✡︎⃝", "⬢", "🜁", "▢", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "Dawn's noise woke me before seeing their deity Elésel Vassergusine. Yet all I'd seen was nothing to what was promised. ~The Green Dream",
        "familiar_text": "BRILLIANCE, GUST, VOID, STEADFAST, SUBMERGED",
        "collector_number": "62/63"
    },
    {
        "name": "PERMAΦROST",
        "costs": ["✡︎⃝", "🜁", "🜃", "🜄"],
        "type": "ELEMENTAL",
        "flavor": "\"In the Celestial Empire, where God sits in Glory with Angels, Cherubim, and Seraphim, we shall see what no eye has seen. There we'll taste eternal joy promised to the worthy, for God created all to share in His Glory. Thus ends the Green Dream.\" ~The Green Dream",
        "familiar_text": "GUST, STEADFAST, SUBMERGED",
        "collector_number": "63/63"
    }
]

def process_green_dream_cards():
    """Convert Green Dream cards to proper JSON format"""
    processed_cards = []
    
    for card_data in green_dream_cards:
        # Extract collector number
        collector_num = int(card_data["collector_number"].split("/")[0])
        
        # Create card entry
        card = {
            "id": f"gd_{collector_num:03d}_{clean_name_for_id(card_data['name'])}",
            "name": card_data["name"],
            "elements": parse_elements(card_data["costs"]),
            "keywords": parse_keywords(card_data["familiar_text"]),
            "cost": len([c for c in card_data["costs"] if c and c.strip()]),
            "power": 0,  # Default power
            "rarity": "common",  # Default rarity
            "type": "Familiar",
            "class": card_data["type"],
            "talents": parse_keywords(card_data["familiar_text"]),
            "set": "The Green Dream",
            "setNumber": card_data["collector_number"],
            "artist": "Unknown",
            "flavor": card_data["flavor"],
            "text": card_data["familiar_text"],
            "image": f"/images/cards/{clean_name_for_id(card_data['name'])}.jpg"
        }
        
        processed_cards.append(card)
    
    return processed_cards

def add_cards_to_database():
    """Add Green Dream cards to the existing database"""
    # Load existing cards
    with open('/workspace/KONIVRER-deck-database/src/data/cards.json', 'r') as f:
        existing_cards = json.load(f)
    
    # Process new cards
    new_cards = process_green_dream_cards()
    
    # Combine cards
    all_cards = existing_cards + new_cards
    
    # Save updated database
    with open('/workspace/KONIVRER-deck-database/src/data/cards.json', 'w') as f:
        json.dump(all_cards, f, indent=2, ensure_ascii=False)
    
    print(f"Added {len(new_cards)} Green Dream cards to the database!")
    print(f"Total cards in database: {len(all_cards)}")
    
    return new_cards

if __name__ == "__main__":
    new_cards = add_cards_to_database()
    print("\nFirst few cards added:")
    for card in new_cards[:3]:
        print(f"- {card['name']} ({card['setNumber']})")