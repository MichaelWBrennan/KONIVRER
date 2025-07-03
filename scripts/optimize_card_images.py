#!/usr/bin/env python3
"""
Card Image Optimization Script for KONIVRER Deck Database

This script optimizes card images for web use by:
1. Resizing them to the standard card size (412×562 pixels)
2. Converting them to both PNG and WebP formats
3. Optimizing file sizes for web delivery

Usage:
    python optimize_card_images.py [source_dir] [target_dir]

    - source_dir: Directory containing source card images (default: /tmp/card_images_download)
    - target_dir: Directory to save optimized images (default: public/assets/cards)
"""

import os
import sys
import glob
from PIL import Image
import re

# Default directories
DEFAULT_SOURCE_DIR = "/tmp/card_images_download"
DEFAULT_TARGET_DIR = "public/assets/cards"

# Standard card dimensions
CARD_WIDTH = 412
CARD_HEIGHT = 562

# Special character mappings for filenames
CHAR_MAPPINGS = {
    'Æ': 'AE',
    'æ': 'ae',
    'Œ': 'OE',
    'œ': 'oe',
    'ß': 'ss',
    'ø': 'o',
    'Ø': 'O',
    ' ': '',
    '-': '',
    '.': '',
    "'": '',
    '"': '',
    '(': '',
    ')': '',
    '[': '',
    ']': '',
    '{': '',
    '}': '',
    '&': 'and',
    '+': 'plus',
    '@': 'at',
    '#': '',
    '$': '',
    '%': 'percent',
    '^': '',
    '*': '',
    '=': 'equals',
    '!': '',
    '?': '',
    ',': '',
    ';': '',
    ':': '',
    '/': '',
    '\\': '',
    '|': '',
    '<': '',
    '>': '',
    '`': '',
    '~': '',
}

def normalize_filename(filename):
    """Normalize filename to uppercase with no special characters."""
    # Remove extension and path
    basename = os.path.splitext(os.path.basename(filename))[0]
    
    # Replace special characters
    for char, replacement in CHAR_MAPPINGS.items():
        basename = basename.replace(char, replacement)
    
    # Convert to uppercase
    return basename.upper()

def optimize_image(source_path, target_dir):
    """Optimize an image for web use."""
    try:
        # Open the image
        img = Image.open(source_path)
        
        # Normalize the filename
        card_name = normalize_filename(source_path)
        
        # Resize the image
        img = img.resize((CARD_WIDTH, CARD_HEIGHT), Image.LANCZOS)
        
        # Create target directory if it doesn't exist
        os.makedirs(target_dir, exist_ok=True)
        
        # Save as PNG
        png_path = os.path.join(target_dir, f"{card_name}.png")
        img.save(png_path, "PNG", optimize=True)
        png_size = os.path.getsize(png_path) // 1024  # Size in KB
        
        # Save as WebP
        webp_path = os.path.join(target_dir, f"{card_name}.webp")
        img.save(webp_path, "WEBP", quality=80, method=6)
        webp_size = os.path.getsize(webp_path) // 1024  # Size in KB
        
        print(f"✅ Optimized: {card_name} (PNG: {png_size}KB, WebP: {webp_size}KB)")
        return True
    except Exception as e:
        print(f"❌ Error optimizing {source_path}: {e}")
        return False

def main():
    # Get source and target directories from command line arguments
    source_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE_DIR
    target_dir = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_TARGET_DIR
    
    # Make sure source directory exists
    if not os.path.isdir(source_dir):
        print(f"Error: Source directory '{source_dir}' does not exist.")
        return
    
    # Get all image files in the source directory
    image_files = []
    for ext in ['*.png', '*.jpg', '*.jpeg', '*.webp', '*.gif']:
        image_files.extend(glob.glob(os.path.join(source_dir, ext)))
        image_files.extend(glob.glob(os.path.join(source_dir, ext.upper())))
    
    if not image_files:
        print(f"No image files found in '{source_dir}'.")
        return
    
    # Process each image
    success_count = 0
    skip_count = 0
    
    for image_file in image_files:
        if optimize_image(image_file, target_dir):
            success_count += 1
        else:
            skip_count += 1
    
    print("\nOptimization complete!")
    print(f"Processed: {success_count} images")
    print(f"Skipped: {skip_count} images")
    print(f"Target directory: {os.path.abspath(target_dir)}")

if __name__ == "__main__":
    main()