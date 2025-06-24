# KONIVRER Card Arts

This directory contains the card art assets for the KONIVRER deck database.

## Overview

- **Total Cards**: 64 card arts
- **Format**: PNG images (825 x 1125 pixels, RGBA)
- **Average Size**: ~1.8MB per image

## Card Categories

The card arts include various elemental and character types:

### Elemental Cards
- **Basic Elements**: DVST, ICE, LAHAR, LAVA, LIGTNING, STEAM, etc.
- **Bright Variants**: BRIGT_DVST, BRIGT_FVLGVRITE, BRIGT_LAHAR, etc.
- **Dark Variants**: DARK_DVST, DARK_FVLGVRITE, DARK_ICE, etc.
- **Chaos Variants**: XAOS_DVST, XAOS_FVLGVRITE, XAOS_GNOME, etc.

### Character Cards
- ABISS, ANGEL, ASH, AVRORA, AZOTH
- GNOME, SALAMANDER, SILPh, VNDINE
- SADE

### Special Cards
- EMBERS, FOG, FROST, GEODE
- MAGMA, MIASMA, MVD, NEKROSIS
- RAINBOVV, SMOKE, SOLAR_, STORM, TAR
- TIPhOON, LIGHT_TIPhOON
- PhVE_ELEMENT_PhLAG

## Usage

These card arts can be referenced in the application using the path:
```
/assets/cards/[CARD_NAME][face,1].png
```

For example:
- `/assets/cards/ABISS[face,1].png`
- `/assets/cards/XAOS_LAVA[face,1].png`

## File Naming Convention

All card files follow the pattern: `[CARD_NAME][face,1].png`

The `[face,1]` suffix appears to indicate these are the front face of the cards, version 1.