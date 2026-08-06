# Spin Wheel Mobile Performance Fix

## Steps
- [x] 1. Move `drop-shadow` filter off the canvas element onto `.wheel-container` (style.css)
- [x] 2. Remove `transition: transform 0.3s ease` from canvas (style.css)
- [x] 3. Add GPU acceleration to canvas: `will-change: transform`, `translateZ(0)` — but converted to canvas-internal rotation (style.css)
- [x] 4. Rewrite spin loops to draw rotation inside the canvas instead of CSS transform (script.js)
- [x] 5. Compute selected index from `nameRotation`/`groupRotation` instead of reading the CSS matrix (script.js)
- [ ] 6. Test on mobile
