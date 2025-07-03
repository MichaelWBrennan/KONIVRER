#!/usr/bin/env python3
"""
Generate Missing Card Images Script for KONIVRER Deck Database

This script generates high-quality placeholder images for missing cards
by using existing high-quality cards as templates.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
import shutil

# List of cards that still have placeholder images
MISSING_CARDS = [
    "BRIGHTFULGURITE",
    "BRIGHTLAHAR",
    "BRIGHTPERMAFROST",
    "BRIGHTTHUNDERSNOW",
    "CHAOS",
    "CHAOSFULGURITE",
    "CHAOSMIST",
    "CHAOSPERMAFROST",
    "CHAOSSTEAM",
    "CHAOSTHUNDERSNOW",
    "DARKFULGURITE",
    "DARKLAHAR",
    "FLAG",
    "LIGHTTYPHOON",
    "PERMAFROST"
]

# Template cards to use for each type
TEMPLATES = {
    "BRIGHT": "BRIGHTDUST",
    "CHAOS": "CHAOSDUST",
    "DARK": "DARKDUST",
    "LIGHT": "TYPHOON",
    "DEFAULT": "DUST"
}

def get_template_for_card(card_name):
    """Get the appropriate template card for a given card name."""
    if card_name.startswith("BRIGHT"):
        return TEMPLATES["BRIGHT"]
    elif card_name.startswith("CHAOS"):
        return TEMPLATES["CHAOS"]
    elif card_name.startswith("DARK"):
        return TEMPLATES["DARK"]
    elif card_name.startswith("LIGHT"):
        return TEMPLATES["LIGHT"]
    elif card_name == "FLAG" or card_name == "PERMAFROST":
        return TEMPLATES["DEFAULT"]
    else:
        return TEMPLATES["DEFAULT"]

def generate_card_image(card_name, template_name, cards_dir):
    """Generate a high-quality placeholder image for a missing card."""
    try:
        # Paths for template and new card
        template_png_path = os.path.join(cards_dir, f"{template_name}.png")
        template_webp_path = os.path.join(cards_dir, f"{template_name}.webp")
        
        new_png_path = os.path.join(cards_dir, f"{card_name}.png")
        new_webp_path = os.path.join(cards_dir, f"{card_name}.webp")
        
        # Check if template exists
        if not os.path.exists(template_png_path) or not os.path.exists(template_webp_path):
            print(f"❌ Template {template_name} not found")
            return False
        
        # Create PNG version
        img = Image.open(template_png_path)
        draw = ImageDraw.Draw(img)
        
        # Add card name as text overlay
        width, height = img.size
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", 36)
        except IOError:
            font = ImageFont.load_default()
        
        text_width = draw.textlength(card_name, font=font)
        text_position = ((width - text_width) / 2, height / 2)
        
        # Add semi-transparent overlay
        overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle([(0, height/2 - 30), (width, height/2 + 30)], fill=(0, 0, 0, 128))
        
        img = Image.alpha_composite(img.convert('RGBA'), overlay)
        draw = ImageDraw.Draw(img)
        
        # Draw text
        draw.text(text_position, card_name, font=font, fill=(255, 255, 255, 255))
        
        # Save as PNG
        img = img.convert('RGB')
        img.save(new_png_path, "PNG", optimize=True)
        
        # Save as WebP
        img.save(new_webp_path, "WEBP", quality=80, method=6)
        
        png_size = os.path.getsize(new_png_path) // 1024  # Size in KB
        webp_size = os.path.getsize(new_webp_path) // 1024  # Size in KB
        
        print(f"✅ Generated: {card_name} (PNG: {png_size}KB, WebP: {webp_size}KB)")
        return True
    except Exception as e:
        print(f"❌ Error generating {card_name}: {e}")
        return False

def main():
    # Get cards directory from command line arguments or use default
    cards_dir = sys.argv[1] if len(sys.argv) > 1 else "public/assets/cards"
    
    # Make sure cards directory exists
    if not os.path.isdir(cards_dir):
        print(f"Error: Cards directory '{cards_dir}' does not exist.")
        return
    
    # Process each missing card
    success_count = 0
    fail_count = 0
    
    for card_name in MISSING_CARDS:
        template_name = get_template_for_card(card_name)
        if generate_card_image(card_name, template_name, cards_dir):
            success_count += 1
        else:
            fail_count += 1
    
    print("\nGeneration complete!")
    print(f"Generated: {success_count} cards")
    print(f"Failed: {fail_count} cards")
    print(f"Cards directory: {os.path.abspath(cards_dir)}")

if __name__ == "__main__":
    main()