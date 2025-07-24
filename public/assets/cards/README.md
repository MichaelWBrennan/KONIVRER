# Card Images Directory

This directory contains optimized card images for the KONIVRER deck database.

## Current Status
- **Images**: High-quality card images installed for all 64 cards
- **Formats**: Both WebP (primary, ~25KB each) and PNG (fallback, ~340KB each) formats available
- **Dimensions**: All images are 412×562 pixels (optimized for web)
- **Ready**: System is configured to use these images automatically
- **Source**: Images sourced from official KONIVRER materials and optimized for web use

## Adding Card Images

### Quick Setup
1. Run the setup script: `./scripts/setup-card-images.sh`
2. Place your card images in `./card-images-source/`
3. Process images: `node scripts/add-card-images.js`

### Manual Setup
1. Place optimized images in this directory
2. Use WebP format for best compression (PNG as fallback)
3. Target size: 412×562 pixels, <200KB per image
4. Naming convention: `CARDNAME.webp` (e.g., `ABISS.webp`, `ANGEL.webp`)

### Expected Files
The system expects 66 card images with these names:
- Basic elements: ABISS, ANGEL, ASH, AURORA, AZOTH, DUST, EMBERS, FOG, FROST, GEODE, GNOME, ICE, LAHAR, LIGHTNING, MAGMA, MIASMA, MUD, NECROSIS, PERMAFROST, RAINBOW, SALAMANDER, SYLPH, SMOKE, SOLAR, STEAM, STORM, TAR, TYPHOON, UNDINE, SHADE, FLAG
- Bright variants: BRIGHTDUST, BRIGHTFULGURITE, BRIGHTLAHAR, BRIGHTLAVA, BRIGHTLIGHTNING, BRIGHTMUD, BRIGHTPERMAFROST, BRIGHTSTEAM, BRIGHTTHUNDERSNOW
- Dark variants: DARKDUST, DARKFULGURITE, DARKICE, DARKLAHAR, DARKLAVA, DARKLIGHTNING, DARKTHUNDERSNOW, DARKTYPHOON
- Light variants: LIGHTTYPHOON
- Chaos variants: CHAOS, CHAOSDUST, CHAOSFULGURITE, CHAOSGNOME, CHAOSICE, CHAOSLAVA, CHAOSLIGHTNING, CHAOSMIST, CHAOSMUD, CHAOSPERMAFROST, CHAOSSALAMANDER, CHAOSSYLPH, CHAOSSTEAM, CHAOSTHUNDERSNOW, CHAOSUNDINE

## Technical Details
- **Format**: WebP preferred (better compression), PNG fallback
- **Dimensions**: 412×562 pixels (aspect ratio preserved)
- **File size**: Target <200KB per image, <13MB total
- **Loading**: Lazy loading implemented, graceful fallbacks
- **Mapping**: Automatic mapping between card names and image files

See `IMAGE_OPTIMIZATION_GUIDE.md` for detailed optimization instructions.
