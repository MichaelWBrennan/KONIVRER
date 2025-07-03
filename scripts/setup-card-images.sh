#!/bin/bash

# KONIVRER Deck Database - Card Image Setup Script
# This script helps set up the card images directory structure

echo "🎴 KONIVRER Card Image Setup"
echo "============================"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ./card-images-source
mkdir -p ./public/assets/cards

# Check if we have any images to work with
if [ -d "./card-images-source" ] && [ "$(ls -A ./card-images-source)" ]; then
    echo "✅ Source images directory exists and contains files"
    echo "📋 Files found:"
    ls -la ./card-images-source/ | grep -E '\.(png|jpg|jpeg|webp)$' | wc -l | xargs echo "   Image files:"
else
    echo "📋 Source images directory is empty"
    echo ""
    echo "To add card images:"
    echo "1. Place your card images in ./card-images-source/"
    echo "2. Name them according to the card names (e.g., ABISS.png, ANGEL.png)"
    echo "3. Run: node scripts/add-card-images.js"
    echo ""
    echo "Expected card names:"
    echo "   ABISS, ANGEL, ASH, AURORA, AZOTH, BRIGHTDUST, BRIGHTFULGURITE,"
    echo "   BRIGHTLAHAR, BRIGHTLAVA, BRIGHTLIGHTNING, BRIGHTMUD, BRIGHTPERMAFROST,"
    echo "   BRIGHTSTEAM, BRIGHTTHUNDERSNOW, DARKDUST, DARKFULGURITE, DARKICE,"
    echo "   DARKLAHAR, DARKLAVA, DARKLIGHTNING, DARKTHUNDERSNOW, DARKTYPHOON,"
    echo "   DUST, EMBERS, FOG, FROST, GEODE, GNOME, ICE, LAHAR, LIGHTTYPHOON,"
    echo "   LIGHTNING, MAGMA, MIASMA, MUD, NECROSIS, PERMAFROST, RAINBOW,"
    echo "   SALAMANDER, SYLPH, SMOKE, SOLAR, STEAM, STORM, TAR, TYPHOON, UNDINE,"
    echo "   CHAOS, CHAOSDUST, CHAOSFULGURITE, CHAOSGNOME, CHAOSICE, CHAOSLAVA,"
    echo "   CHAOSLIGHTNING, CHAOSMIST, CHAOSMUD, CHAOSPERMAFROST, CHAOSSALAMANDER,"
    echo "   CHAOSSYLPH, CHAOSSTEAM, CHAOSTHUNDERSNOW, CHAOSUNDINE, SHADE, FLAG"
fi

# Check current card images
echo ""
echo "📊 Current card images status:"
if [ -d "./public/assets/cards" ] && [ "$(ls -A ./public/assets/cards)" ]; then
    echo "✅ Cards directory exists"
    image_count=$(ls ./public/assets/cards/*.{png,webp} 2>/dev/null | wc -l)
    echo "   Image files: $image_count"
    
    if [ $image_count -gt 0 ]; then
        total_size=$(du -sh ./public/assets/cards/ | cut -f1)
        echo "   Total size: $total_size"
    fi
else
    echo "📋 No card images currently installed"
    echo "   The application will use fallback card designs"
fi

# Check for image processing tools
echo ""
echo "🔧 Image processing tools:"
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick is available"
    convert_version=$(convert -version | head -n1)
    echo "   $convert_version"
else
    echo "❌ ImageMagick not found"
    echo "   Install with: apt-get install imagemagick (Linux) or brew install imagemagick (macOS)"
fi

if node -e "require('sharp')" 2>/dev/null; then
    echo "✅ Sharp (Node.js) is available"
else
    echo "❌ Sharp not found"
    echo "   Install with: npm install sharp"
fi

echo ""
echo "📖 Next steps:"
echo "1. Add your card images to ./card-images-source/"
echo "2. Run: node scripts/add-card-images.js"
echo "3. Test with: npm run dev"
echo ""
echo "For more information, see IMAGE_OPTIMIZATION_GUIDE.md"