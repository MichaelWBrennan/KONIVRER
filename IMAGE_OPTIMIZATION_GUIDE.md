# Card Image Optimization Guide

## Current Issue
The card images in `public/assets/cards/` are corrupted (CRC errors) and too large for Vercel deployment:
- **Current size**: ~1.8MB per image × 64 images = ~115MB total
- **Vercel limit**: ~100MB for free tier
- **Status**: PNG files have CRC errors and cannot be processed

## Recommended Solution

### 1. Image Requirements
- **Format**: WebP (better compression) or optimized PNG
- **Dimensions**: 412×562 pixels (50% of current 825×1125)
- **Target size**: <200KB per image
- **Total target**: <13MB for all 64 images

### 2. Optimization Steps

#### Option A: Using ImageMagick (if you have working source images)
```bash
# Convert to WebP with 50% size reduction
for img in *.png; do
  convert "$img" -resize 50% -quality 85 "${img%.png}.webp"
done

# Or optimize PNG
for img in *.png; do
  convert "$img" -resize 50% -quality 85 -strip "${img%.png}_optimized.png"
done
```

#### Option B: Using online tools
1. Use tools like TinyPNG, Squoosh, or ImageOptim
2. Resize to 412×562 pixels
3. Compress to <200KB per image

#### Option C: Programmatic optimization
```javascript
// Example using sharp (Node.js)
const sharp = require('sharp');

await sharp(inputPath)
  .resize(412, 562)
  .webp({ quality: 85 })
  .toFile(outputPath);
```

### 3. Implementation Changes

The application now gracefully handles missing images:
- Falls back to card-back-new.png when images fail to load
- Uses centralized mapping in `cardArtMapping.js`
- Logs image loading status for debugging

### 4. Vercel Deployment Optimization

To stay within Vercel limits:
1. **Remove corrupted images**: Current images are unusable
2. **Add optimized images**: Follow size guidelines above
3. **Consider CDN**: For larger image sets, use external CDN
4. **Lazy loading**: Already implemented in components

### 5. Next Steps

1. **Immediate**: Remove corrupted images to fix deployment
2. **Short-term**: Add placeholder images or use external CDN
3. **Long-term**: Implement proper image optimization pipeline

## File Structure
```
public/assets/cards/
├── [CARDNAME].webp (recommended)
└── [CARDNAME].png (fallback)
```

## Testing
After adding optimized images:
1. Run `npm run dev`
2. Check browser console for image loading logs
3. Verify images display correctly
4. Test deployment size with `npm run build`