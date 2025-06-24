#!/usr/bin/env python3
"""
Script to rename all card image files to single words
"""

import os
import shutil

# Mapping from current filename to new single-word filename
RENAME_MAP = {
    'ABISS_face_1.png': 'ABISS.png',
    'ANGEL_face_1.png': 'ANGEL.png',
    'ASH_face_1.png': 'ASH.png',
    'AVRORA_face_1.png': 'AURORA.png',
    'AZOTH_face_1.png': 'AZOTH.png',
    
    # Bright variants
    'BRIGT_DVST_face_1.png': 'BRIGHTDUST.png',
    'BRIGT_FVLGVRITE_face_1.png': 'BRIGHTFULGURITE.png',
    'BRIGT_LAHAR_face_1.png': 'BRIGHTLAHAR.png',
    'BRIGT_LAVA_face_1.png': 'BRIGHTLAVA.png',
    'BRIGT_LIGTNING_face_1.png': 'BRIGHTLIGHTNING.png',
    'BRIGT_MVD_face_1.png': 'BRIGHTMUD.png',
    'BRIGT_PERMAPHROST_face_1.png': 'BRIGHTPERMAFROST.png',
    'BRIGT_PERMAPhROST_face_1.png': 'BRIGHTPERMAFROST2.png',  # duplicate
    'BRIGT_STEAM_face_1.png': 'BRIGHTSTEAM.png',
    'BRIGT_THVNDERSNOVV_face_1.png': 'BRIGHTTHUNDERSNOW.png',
    
    # Dark variants
    'DARK_DVST_face_1.png': 'DARKDUST.png',
    'DARK_FVLGVRITE_face_1.png': 'DARKFULGURITE.png',
    'DARK_ICE_face_1.png': 'DARKICE.png',
    'DARK_LAHAR_face_1.png': 'DARKLAHAR.png',
    'DARK_LAVA_face_1.png': 'DARKLAVA.png',
    'DARK_LIGTNING_face_1.png': 'DARKLIGHTNING.png',
    'DARK_THVNDERSNOVV_face_1.png': 'DARKTHUNDERSNOW.png',
    'DARK_TIPHOON_face_1.png': 'DARKTYPHOON.png',
    'DARK_TIPhOON_face_1.png': 'DARKTYPHOON2.png',  # duplicate
    
    # Basic elements
    'DVST_face_1.png': 'DUST.png',
    'EMBERS_face_1.png': 'EMBERS.png',
    'FOG_face_1.png': 'FOG.png',
    'FROST_face_1.png': 'FROST.png',
    'GEODE_face_1.png': 'GEODE.png',
    'GNOME_face_1.png': 'GNOME.png',
    'ICE_face_1.png': 'ICE.png',
    'LAHAR_face_1.png': 'LAHAR.png',
    'LIGHT_TIPHOON_face_1.png': 'LIGHTTYPHOON.png',
    'LIGHT_TIPhOON_face_1.png': 'LIGHTTYPHOON2.png',  # duplicate
    'LIGTNING_face_1.png': 'LIGHTNING.png',
    'MAGMA_face_1.png': 'MAGMA.png',
    'MIASMA_face_1.png': 'MIASMA.png',
    'MVD_face_1.png': 'MUD.png',
    'NEKROSIS_face_1.png': 'NECROSIS.png',
    'PERMAPHROST_face_1.png': 'PERMAFROST.png',
    'PERMAPhROST_face_1.png': 'PERMAFROST2.png',  # duplicate
    'PHIVE_ELEMENT_PHLAG_face_1.png': 'FLAG.png',
    'PhVE_ELEMENT_PhLAG_face_6.png': 'FLAG2.png',  # duplicate
    'RAINBOVV_face_1.png': 'RAINBOW.png',
    'SADE_face_1.png': 'SHADE.png',
    'SALAMANDER_face_1.png': 'SALAMANDER.png',
    'SILPH_face_1.png': 'SYLPH.png',
    'SMOKE_face_1.png': 'SMOKE.png',
    'SOLAR_face_1.png': 'SOLAR.png',
    'STEAM_face_1.png': 'STEAM.png',
    'STORM_face_1.png': 'STORM.png',
    'TAR_face_1.png': 'TAR.png',
    'TIPHOON_face_1.png': 'TYPHOON.png',
    'TIPhOON_face_1.png': 'TYPHOON2.png',  # duplicate
    'VNDINE_face_1.png': 'UNDINE.png',
    
    # Chaos variants
    'XAOS_DVST_face_1.png': 'CHAOSDUST.png',
    'XAOS_FVLGVRITE_face_1.png': 'CHAOSFULGURITE.png',
    'XAOS_GNOME_face_1.png': 'CHAOSGNOME.png',
    'XAOS_ICE_face_1.png': 'CHAOSICE.png',
    'XAOS_LAVA_face_1.png': 'CHAOSLAVA.png',
    'XAOS_LIGTNING_face_1.png': 'CHAOSLIGHTNING.png',
    'XAOS_MIST_face_1.png': 'CHAOSMIST.png',
    'XAOS_MVD_face_1.png': 'CHAOSMUD.png',
    'XAOS_PERMAPHROST_face_1.png': 'CHAOSPERMAFROST.png',
    'XAOS_PERMAPhROST_face_1.png': 'CHAOSPERMAFROST2.png',  # duplicate
    'XAOS_SALAMANDER_face_1.png': 'CHAOSSALAMANDER.png',
    'XAOS_SILPH_face_1.png': 'CHAOSSYLPH.png',
    'XAOS_STEAM_face_1.png': 'CHAOSSTEAM.png',
    'XAOS_THVNDERSNOVV_face_1.png': 'CHAOSTHUNDERSNOW.png',
    'XAOS_VNDINE_face_1.png': 'CHAOSUNDINE.png',
    'XAOS_face_1.png': 'CHAOS.png',
}

def rename_card_files():
    """Rename all card files according to the mapping"""
    cards_dir = 'public/assets/cards'
    
    if not os.path.exists(cards_dir):
        print(f"Error: {cards_dir} directory not found")
        return
    
    renamed_count = 0
    skipped_count = 0
    
    for old_filename, new_filename in RENAME_MAP.items():
        old_path = os.path.join(cards_dir, old_filename)
        new_path = os.path.join(cards_dir, new_filename)
        
        if os.path.exists(old_path):
            if os.path.exists(new_path):
                print(f"⚠️  Skipping {old_filename} → {new_filename} (target exists)")
                skipped_count += 1
            else:
                shutil.move(old_path, new_path)
                print(f"✅ Renamed {old_filename} → {new_filename}")
                renamed_count += 1
        else:
            print(f"❌ File not found: {old_filename}")
    
    print(f"\n📊 Summary:")
    print(f"   Renamed: {renamed_count} files")
    print(f"   Skipped: {skipped_count} files")
    print(f"   Total processed: {len(RENAME_MAP)} mappings")

if __name__ == "__main__":
    rename_card_files()