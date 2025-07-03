#!/usr/bin/env python3
"""
KONIVRER Card Image Optimizer

This script processes card images from a source directory, optimizes them,
and saves them in both PNG and WebP formats to the target directory.

Usage:
    python optimize_card_images.py [source_dir] [target_dir]

Requirements:
    - Pillow (PIL): pip install pillow
"""

import os
import sys
import re
from PIL import Image
import shutil
from pathlib import Path

# Target dimensions for card images
TARGET_WIDTH = 412
TARGET_HEIGHT = 562

# Mapping of filenames with [face,1] to standard names
def clean_filename(filename):
    # Remove [face,1] and other notations
    clean_name = re.sub(r'\[face,\d+\]', '', filename)
    clean_name = re.sub(r'_face_\d+', '', clean_name)
    
    # Replace underscores with spaces for variant cards
    if '_' in clean_name:
        parts = clean_name.split('_')
        prefix = parts[0]
        base = '_'.join(parts[1:])
        
        # Special mappings for variant cards
        if prefix == 'BRIGT':
            prefix = 'BRIGHT'
        elif prefix == 'XAOS':
            prefix = 'CHAOS'
        
        clean_name = f"{prefix}{base}"
    
    # Remove file extension
    clean_name = os.path.splitext(clean_name)[0]
    
    # Special case mappings
    name_mappings = {
        'AVRORA': 'AURORA',
        'SILPh': 'SYLPH',
        'NEKROSIS': 'NECROSIS',
        'SADE': 'SHADE',
        'LIGTNING': 'LIGHTNING',
        'TIPhOON': 'TYPHOON',
        'MVD': 'MUD',
        'DVST': 'DUST',
        'VNDINE': 'UNDINE',
        'RAINBOVV': 'RAINBOW',
        'SOLAR_': 'SOLAR',
        'THVNDERSNOVV': 'THUNDERSNOW',
        'FVLGVRITE': 'FULGURITE',
    }
    
    # Apply mappings
    for old, new in name_mappings.items():
        clean_name = clean_name.replace(old, new)
    
    return clean_name

def optimize_image(source_path, target_dir, filename):
    """Optimize an image to the target dimensions and save in PNG and WebP formats"""
    try:
        # Open the image
        img = Image.open(source_path)
        
        # Calculate new dimensions while preserving aspect ratio
        width, height = img.size
        ratio = min(TARGET_WIDTH / width, TARGET_HEIGHT / height)
        new_width = int(width * ratio)
        new_height = int(height * ratio)
        
        # Resize the image
        img = img.resize((new_width, new_height), Image.LANCZOS)
        
        # Create a new image with the target dimensions (white background)
        new_img = Image.new("RGBA", (TARGET_WIDTH, TARGET_HEIGHT), (0, 0, 0, 0))
        
        # Paste the resized image in the center
        x_offset = (TARGET_WIDTH - new_width) // 2
        y_offset = (TARGET_HEIGHT - new_height) // 2
        new_img.paste(img, (x_offset, y_offset), img if img.mode == 'RGBA' else None)
        
        # Save as PNG
        png_path = os.path.join(target_dir, f"{filename}.png")
        new_img.save(png_path, "PNG", optimize=True)
        
        # Save as WebP with higher compression
        webp_path = os.path.join(target_dir, f"{filename}.webp")
        new_img.save(webp_path, "WEBP", quality=80, method=6)
        
        print(f"✅ Optimized: {filename} (PNG: {os.path.getsize(png_path) // 1024}KB, WebP: {os.path.getsize(webp_path) // 1024}KB)")
        return True
    except Exception as e:
        print(f"❌ Error processing {source_path}: {e}")
        return False

def main():
    # Get source and target directories
    if len(sys.argv) >= 3:
        source_dir = sys.argv[1]
        target_dir = sys.argv[2]
    else:
        source_dir = "/tmp/card_images_download"
        target_dir = "/workspace/KONIVRER-deck-database/public/assets/cards"
    
    # Ensure target directory exists
    os.makedirs(target_dir, exist_ok=True)
    
    # Process all PNG files in the source directory
    processed = 0
    skipped = 0
    
    for filename in os.listdir(source_dir):
        if filename.endswith(".png"):
            source_path = os.path.join(source_dir, filename)
            clean_name = clean_filename(filename)
            
            if optimize_image(source_path, target_dir, clean_name):
                processed += 1
            else:
                skipped += 1
    
    print(f"\nOptimization complete!")
    print(f"Processed: {processed} images")
    print(f"Skipped: {skipped} images")
    print(f"Target directory: {target_dir}")

if __name__ == "__main__":
    main()