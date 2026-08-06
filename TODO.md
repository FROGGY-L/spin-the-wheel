# Spin Wheel Mobile Performance Fix

## Steps
- [x] 1. Move `drop-shadow` filter off the canvas element onto `.wheel-container` (style.css)
- [x] 2. Remove `transition: transform 0.3s ease` from canvas (style.css)
- [x] 3. Add GPU acceleration to canvas: `will-change: transform`, `translateZ(0)` (style.css)
- [x] 4. Set `style.transition = "none"` once before spin loop instead of each frame (script.js)
- [ ] 5. Test on mobile
