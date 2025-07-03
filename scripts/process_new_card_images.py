#!/usr/bin/env python3
"""
Process New Card Images Script for KONIVRER Deck Database

This script processes new card images from the Google Drive download,
renames them according to the expected naming convention, and optimizes them.
"""

import os
import sys
import re
from PIL import Image
import shutil

# Mapping of source filenames to expected filenames
FILENAME_MAPPING = {
    "ABISS[face,1]": "ABISS",
    "ANGEL[face,1]": "ANGEL",
    "ASH[face,1]": "ASH",
    "AVRORA[face,1]": "AURORA",
    "AZOTH[face,1]": "AZOTH",
    "BRIGT_DVST[face,1]": "BRIGHTDUST",
    "BRIGT_FVLGVRITE[face,1]": "BRIGHTFULGURITE",
    "BRIGT_LAVA[face,1]": "BRIGHTLAVA",
    "BRIGT_LIGTNING[face,1]": "BRIGHTLIGHTNING",
    "BRIGT_MVD[face,1]": "BRIGHTMUD",
    "BRIGT_STEAM[face,1]": "BRIGHTSTEAM",
    "DARK_DVST[face,1]": "DARKDUST",
    "DARK_ICE[face,1]": "DARKICE",
    "DARK_LAVA[face,1]": "DARKLAVA",
    "DARK_LIGTNING[face,1]": "DARKLIGHTNING",
    "DARK_THVNDERSNOVV[face,1]": "DARKTHUNDERSNOW",
    "DARK_TIPhOON[face,1]": "DARKTYPHOON",
    "DVST[face,1]": "DUST",
    "EMBERS[face,1]": "EMBERS",
    "FOG[face,1]": "FOG",
    "FROST[face,1]": "FROST",
    "GEODE[face,1]": "GEODE",
    "GNOME[face,1]": "GNOME",
    "ICE[face,1]": "ICE",
    "LAHAR[face,1]": "LAHAR",
    "LIGTNING[face,1]": "LIGHTNING",
    "MAGMA[face,1]": "MAGMA",
    "MIASMA[face,1]": "MIASMA",
    "MVD[face,1]": "MUD",
    "NEKROSIS[face,1]": "NECROSIS",
    "RAINBOVV[face,1]": "RAINBOW",
    "SADE[face,1]": "SHADE",
    "SALAMANDER[face,1]": "SALAMANDER",
    "SILPh[face,1]": "SYLPH",
    "SMOKE[face,1]": "SMOKE",
    "SOLAR_[face,1]": "SOLAR",
    "STEAM[face,1]": "STEAM",
    "STORM[face,1]": "STORM",
    "TAR[face,1]": "TAR",
    "TIPhOON[face,1]": "TYPHOON",
    "VNDINE[face,1]": "UNDINE",
    "XAOS_DVST[face,1]": "CHAOSDUST",
    "XAOS_GNOME[face,1]": "CHAOSGNOME",
    "XAOS_ICE[face,1]": "CHAOSICE",
    "XAOS_LAVA[face,1]": "CHAOSLAVA",
    "XAOS_LIGTNING[face,1]": "CHAOSLIGHTNING",
    "XAOS_MVD[face,1]": "CHAOSMUD",
    "XAOS_SALAMANDER[face,1]": "CHAOSSALAMANDER",
    "XAOS_SILPh[face,1]": "CHAOSSYLPH",
    "XAOS_VNDINE[face,1]": "CHAOSUNDINE",
    "XAOS[face,1]": "XAOS",
}

def resize_and_optimize_image(source_path, target_png_path, target_webp_path, size=(412, 562)):
    """Resize and optimize an image for web use."""
    try:
        # Open and resize the image
        img = Image.open(source_path)
        img = img.resize(size, Image.Resampling.LANCZOS)
        
        # Save as PNG
        img.save(target_png_path, "PNG", optimize=True)
        
        # Save as WebP
        img.save(target_webp_path, "WEBP", quality=80, method=6)
        
        png_size = os.path.getsize(target_png_path) // 1024  # Size in KB
        webp_size = os.path.getsize(target_webp_path) // 1024  # Size in KB
        
        return png_size, webp_size
    except Exception as e:
        print(f"❌ Error processing {source_path}: {e}")
        return None, None

def process_card_images(source_dir, target_dir):
    """Process card images from source directory to target directory."""
    if not os.path.isdir(source_dir):
        print(f"Error: Source directory '{source_dir}' does not exist.")
        return
    
    if not os.path.isdir(target_dir):
        print(f"Error: Target directory '{target_dir}' does not exist.")
        return
    
    processed_count = 0
    skipped_count = 0
    
    # Process each image in the source directory
    for filename in os.listdir(source_dir):
        if not filename.lower().endswith('.png'):
            continue
        
        # Extract the base name without extension
        base_name = os.path.splitext(filename)[0]
        
        # Get the target name from the mapping
        if base_name in FILENAME_MAPPING:
            target_name = FILENAME_MAPPING[base_name]
            
            source_path = os.path.join(source_dir, filename)
            target_png_path = os.path.join(target_dir, f"{target_name}.png")
            target_webp_path = os.path.join(target_dir, f"{target_name}.webp")
            
            # Resize and optimize the image
            png_size, webp_size = resize_and_optimize_image(source_path, target_png_path, target_webp_path)
            
            if png_size and webp_size:
                print(f"✅ Processed: {base_name} → {target_name} (PNG: {png_size}KB, WebP: {webp_size}KB)")
                processed_count += 1
            else:
                skipped_count += 1
        else:
            print(f"⚠️ No mapping found for: {base_name}")
            skipped_count += 1
    
    print("\nProcessing complete!")
    print(f"Processed: {processed_count} images")
    print(f"Skipped: {skipped_count} images")
    print(f"Target directory: {os.path.abspath(target_dir)}")

if __name__ == "__main__":
    # Get source and target directories from command line arguments or use defaults
    source_dir = sys.argv[1] if len(sys.argv) > 1 else "/tmp/new_card_images/Card images"
    target_dir = sys.argv[2] if len(sys.argv) > 2 else "public/assets/cards"
    
    process_card_images(source_dir, target_dir)