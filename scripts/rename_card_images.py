#!/usr/bin/env python3
"""
Card Image Renaming Script for KONIVRER Deck Database

This script renames card images to match the expected naming convention.
"""

import os
import shutil
import glob

# Mapping of generated filenames to expected filenames
FILENAME_MAPPING = {
    'ABISSFACE1': 'ABISS',
    'ANGELFACE1': 'ANGEL',
    'ASHFACE1': 'ASH',
    'AVRORAFACE1': 'AURORA',
    'AZOTHFACE1': 'AZOTH',
    'BRIGT_DVSTFACE1': 'BRIGHTDUST',
    'BRIGT_LAVAFACE1': 'BRIGHTLAVA',
    'BRIGT_LIGTNINGFACE1': 'BRIGHTLIGHTNING',
    'BRIGT_MVDFACE1': 'BRIGHTMUD',
    'BRIGT_STEAMFACE1': 'BRIGHTSTEAM',
    'DARK_DVSTFACE1': 'DARKDUST',
    'DARK_ICEFACE1': 'DARKICE',
    'DARK_LAVAFACE1': 'DARKLAVA',
    'DARK_LIGTNINGFACE1': 'DARKLIGHTNING',
    'DARK_THVNDERSNOVVFACE1': 'DARKTHUNDERSNOW',
    'DARK_TIPHOONFACE1': 'DARKTYPHOON',
    'DVSTFACE1': 'DUST',
    'EMBERSFACE1': 'EMBERS',
    'FOGFACE1': 'FOG',
    'FROSTFACE1': 'FROST',
    'GEODEFACE1': 'GEODE',
    'GNOMEFACE1': 'GNOME',
    'ICEFACE1': 'ICE',
    'LAHARFACE1': 'LAHAR',
    'LIGTNINGFACE1': 'LIGHTNING',
    'MAGMAFACE1': 'MAGMA',
    'MIASMAFACE1': 'MIASMA',
    'MVDFACE1': 'MUD',
    'NEKROSISFACE1': 'NECROSIS',
    'RAINBOVVFACE1': 'RAINBOW',
    'SADEFACE1': 'SHADE',
    'SALAMANDERFACE1': 'SALAMANDER',
    'SILPHFACE1': 'SYLPH',
    'SMOKEFACE1': 'SMOKE',
    'SOLAR_FACE1': 'SOLAR',
    'STEAMFACE1': 'STEAM',
    'STORMFACE1': 'STORM',
    'TARFACE1': 'TAR',
    'TIPHOONFACE1': 'TYPHOON',
    'VNDINEFACE1': 'UNDINE',
    'XAOSFACE1': 'XAOS',
    'XAOS_DVSTFACE1': 'CHAOSDUST',
    'XAOS_GNOMEFACE1': 'CHAOSGNOME',
    'XAOS_ICEFACE1': 'CHAOSICE',
    'XAOS_LAVAFACE1': 'CHAOSLAVA',
    'XAOS_LIGTNINGFACE1': 'CHAOSLIGHTNING',
    'XAOS_MVDFACE1': 'CHAOSMUD',
    'XAOS_SALAMANDERFACE1': 'CHAOSSALAMANDER',
    'XAOS_SILPHFACE1': 'CHAOSSYLPH',
    'XAOS_VNDINEFACE1': 'CHAOSUNDINE',
}

def rename_card_images(directory):
    """Rename card images to match the expected naming convention."""
    renamed_count = 0
    skipped_count = 0
    
    for old_name, new_name in FILENAME_MAPPING.items():
        # Check for PNG files
        png_path = os.path.join(directory, f"{old_name}.png")
        if os.path.exists(png_path):
            new_png_path = os.path.join(directory, f"{new_name}.png")
            shutil.move(png_path, new_png_path)
            renamed_count += 1
            print(f"✅ Renamed: {old_name}.png → {new_name}.png")
        else:
            skipped_count += 1
            print(f"⚠️ Not found: {old_name}.png")
        
        # Check for WebP files
        webp_path = os.path.join(directory, f"{old_name}.webp")
        if os.path.exists(webp_path):
            new_webp_path = os.path.join(directory, f"{new_name}.webp")
            shutil.move(webp_path, new_webp_path)
            renamed_count += 1
            print(f"✅ Renamed: {old_name}.webp → {new_name}.webp")
        else:
            skipped_count += 1
            print(f"⚠️ Not found: {old_name}.webp")
    
    print("\nRenaming complete!")
    print(f"Renamed: {renamed_count} files")
    print(f"Skipped: {skipped_count} files")
    print(f"Directory: {os.path.abspath(directory)}")

if __name__ == "__main__":
    import sys
    
    # Get directory from command line arguments or use default
    directory = sys.argv[1] if len(sys.argv) > 1 else "public/assets/cards"
    
    rename_card_images(directory)