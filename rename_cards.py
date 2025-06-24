#!/usr/bin/env python3
"""
Script to rename card art files to match exact database card names
"""

import os
import json
import shutil
from pathlib import Path

# Load card names from database
with open('src/data/cards.json', 'r', encoding='utf-8') as f:
    cards_data = json.load(f)

# Extract all card names
db_card_names = [card['name'] for card in cards_data]
print(f"Found {len(db_card_names)} cards in database")

# Current card files directory
cards_dir = Path('public/assets/cards')
current_files = list(cards_dir.glob('*.png'))

print(f"Found {len(current_files)} PNG files")

# Create mapping from current filenames to database names
filename_to_db_name = {
    # Direct matches (no changes needed)
    'ABISS': 'ABISS',
    'ANGEL': 'ANGEL', 
    'ASH': 'ASH',
    'AVRORA': 'AVRORA',
    'FROST': 'FROST',
    'DVST': 'DVST',
    'EMBERS': 'EMBERS',
    'FOG': 'FOG',
    'GEODE': 'GEODE',
    'GNOME': 'GNOME',
    'ICE': 'ICE',
    'LAHAR': 'LAHAR',
    'MAGMA': 'MAGMA',
    'MIASMA': 'MIASMA',
    'MVD': 'MVD',
    'NEKROSIS': 'NEKROSIS',
    'RAINBOVV': 'RAINBOVV',
    'SALAMANDER': 'SALAMANDER',
    'SMOKE': 'SMOKE',
    'STEAM': 'STEAM',
    'STORM': 'STORM',
    'TAR': 'TAR',
    'VNDINE': 'VNDINE',
    'XAOS': 'XAOS',
    
    # Greek letter conversions
    'AZOTH': 'AZOΘ',
    'SADE': 'ΣADE',
    'SOLAR_': 'SOLAR ☉',
    
    # Phi conversions
    'PhVE_ELEMENT_PhLAG': 'ΦIVE ELEMENT ΦLAG',
    'SILPh': 'SILΦ',
    'TIPhOON': 'TIΦOON',
    'DARK_TIPhOON': 'DARK TIΦOON',
    'LIGHT_TIPhOON': 'LIGHT TIΦOON',
    'PERMAPhROST': 'PERMAΦROST',
    'BRIGT_PERMAPhROST': 'BRIΓT PERMAΦROST',
    'XAOS_PERMAPhROST': 'XAOS PERMAΦROST',
    'XAOS_SILPh': 'XAOS SILΦ',
    
    # BRIGT -> BRIΓT conversions (with spaces)
    'BRIGT_DVST': 'BRIΓT DVST',
    'BRIGT_FVLGVRITE': 'BRIΓT FVLGVRITE', 
    'BRIGT_LAHAR': 'BRIΓT LAHAR',
    'BRIGT_LAVA': 'BRIΓT LAVA',
    'BRIGT_LIGTNING': 'BRIΓT LIΓTNING',
    'BRIGT_MVD': 'BRIΓT MVD',
    'BRIGT_STEAM': 'BRIΓT STEAM',
    'BRIGT_THVNDERSNOVV': 'BRIΓT THVNDERSNOVV',
    
    # Files that already have Greek letters
    'BRIΓT_DVST': 'BRIΓT DVST',
    'BRIΓT_FVLGVRITE': 'BRIΓT FVLGVRITE',
    'BRIΓT_LAHAR': 'BRIΓT LAHAR',
    'BRIΓT_LAVA': 'BRIΓT LAVA',
    'BRIΓT_LIΓTNING': 'BRIΓT LIΓTNING',
    'BRIΓT_MVD': 'BRIΓT MVD',
    'BRIΓT_STEAM': 'BRIΓT STEAM',
    'BRIΓT_THVNDERSNOVV': 'BRIΓT THVNDERSNOVV',
    'BRIΓT_PERMAΦROST': 'BRIΓT PERMAΦROST',
    
    # DARK conversions (with spaces)
    'DARK_DVST': 'DARK DVST',
    'DARK_FVLGVRITE': 'DARK FVLGVRITE',
    'DARK_ICE': 'DARK ICE',
    'DARK_LAHAR': 'DARK LAHAR',
    'DARK_LAVA': 'DARK LAVA',
    'DARK_LIGTNING': 'DARK LIΓTNING',
    'DARK_THVNDERSNOVV': 'DARK THVNDERSNOVV',
    'DARK_LIΓTNING': 'DARK LIΓTNING',
    'DARK_TIΦOON': 'DARK TIΦOON',
    
    # LIGTNING -> LIΓTNING
    'LIGTNING': 'LIΓTNING',
    'LIΓTNING': 'LIΓTNING',
    
    # Other Greek letter files
    'AZOΘ': 'AZOΘ',
    'ΣADE': 'ΣADE',
    'TIΦOON': 'TIΦOON',
    'LIGHT_TIΦOON': 'LIGHT TIΦOON',
    'PERMAΦROST': 'PERMAΦROST',
    'SILΦ': 'SILΦ',
    
    # XAOS conversions (with spaces)
    'XAOS_DVST': 'XAOS DVST',
    'XAOS_FVLGVRITE': 'XAOS FVLGVRITE',
    'XAOS_GNOME': 'XAOS GNOME',
    'XAOS_ICE': 'XAOS ICE',
    'XAOS_LAVA': 'XAOS LAVA',
    'XAOS_LIGTNING': 'XAOS LIΓTNING',
    'XAOS_MIST': 'XAOS MIST',
    'XAOS_MVD': 'XAOS MVD',
    'XAOS_SALAMANDER': 'XAOS SALAMANDER',
    'XAOS_STEAM': 'XAOS STEAM',
    'XAOS_THVNDERSNOVV': 'XAOS THVNDERSNOVV',
    'XAOS_VNDINE': 'XAOS VNDINE',
    'XAOS_LIΓTNING': 'XAOS LIΓTNING',
    'XAOS_SILΦ': 'XAOS SILΦ',
    'XAOS_PERMAΦROST': 'XAOS PERMAΦROST',
}

# Function to sanitize filename (replace invalid characters)
def sanitize_filename(name):
    """Convert database name to valid filename"""
    # Replace characters that are problematic in filenames
    sanitized = name.replace('/', '_').replace('\\', '_').replace(':', '_')
    sanitized = sanitized.replace('*', '_').replace('?', '_').replace('"', '_')
    sanitized = sanitized.replace('<', '_').replace('>', '_').replace('|', '_')
    return sanitized

# Perform the renaming
renamed_count = 0
for png_file in current_files:
    if png_file.name == 'README.md':
        continue
        
    # Extract base name (remove _face_X.png)
    base_name = png_file.stem
    if '_face_' in base_name:
        base_name = base_name.split('_face_')[0]
        face_suffix = '_face_' + png_file.stem.split('_face_')[1]
    else:
        face_suffix = '_face_1'  # default
    
    if base_name in filename_to_db_name:
        new_db_name = filename_to_db_name[base_name]
        new_filename = sanitize_filename(new_db_name) + face_suffix + '.png'
        new_path = cards_dir / new_filename
        
        if png_file.name != new_filename:
            print(f"Renaming: {png_file.name} -> {new_filename}")
            shutil.move(str(png_file), str(new_path))
            renamed_count += 1
        else:
            print(f"No change needed: {png_file.name}")
    else:
        print(f"WARNING: No mapping found for {base_name}")

print(f"\nRenamed {renamed_count} files")

# Verify all database cards have corresponding files
print("\nVerifying coverage:")
missing_files = []
for card_name in db_card_names:
    sanitized_name = sanitize_filename(card_name)
    expected_file = cards_dir / f"{sanitized_name}_face_1.png"
    if card_name == 'ΦIVE ELEMENT ΦLAG':
        expected_file = cards_dir / f"{sanitized_name}_face_6.png"
    
    if not expected_file.exists():
        missing_files.append(card_name)

if missing_files:
    print(f"Missing files for {len(missing_files)} cards:")
    for card in missing_files:
        print(f"  - {card}")
else:
    print("✅ All database cards have corresponding image files!")