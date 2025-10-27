# Asset Optimize - Asset Analysis and Optimization

Command template for analyzing and optimizing project assets while maintaining quality.

## Usage
```bash
/asset-optimize [folder-path]
```

## Actions
1. Scan specified folder for oversized assets (>5MB videos, >2MB images)
2. Analyze current file formats and compression levels
3. Recommend optimization strategies
4. Create backups in `/backup` folder
5. Apply optimizations with quality preservation
6. Verify asset detection still works after optimization

## Quality Standards
- **Videos**: Target 2-3 Mbps bitrate, H.264 codec, web-optimized
- **Images**: WebP format, 75-85% quality, appropriate resolution
- **Hero Assets**: Maintain visual quality for professional showcase
- **Thumbnails**: Optimize for preview card display sizes

## Safety Checks
- Always backup originals before optimization
- Test that asset scanning system still finds optimized files
- Verify overlay system displays optimized assets correctly
- Check file sizes don't break performance budgets