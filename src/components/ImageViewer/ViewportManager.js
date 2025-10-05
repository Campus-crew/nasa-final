class ViewportManager {
  constructor() {
    this.baseTileSize = 1024; // Larger base tiles for less memory usage
    this.maxConcurrentLoads = 3; // Reduced for memory optimization
    this.priorityLevels = {
      IMMEDIATE: 0,  // Currently visible tiles only
      HIGH: 1,       // Small buffer
      MEDIUM: 2,     // Removed to reduce tiles
      LOW: 3         // Removed to reduce tiles
    };
    this.tileSizeCache = new Map();
    this.visibleTilesCache = new Map();
    this.lastViewportHash = null;
  }

  // Simplified adaptive tile size - larger tiles for memory efficiency
  getAdaptiveTileSize(scale) {
    const scaleKey = Math.round(scale * 10) / 10; // Less granular caching
    
    if (this.tileSizeCache.has(scaleKey)) {
      return this.tileSizeCache.get(scaleKey);
    }

    let tileSize;
    
    if (scale <= 0.2) {
      tileSize = 2048; // Very large tiles for low zoom
    } else if (scale <= 0.5) {
      tileSize = 1024; // Large tiles for medium zoom
    } else if (scale <= 1.0) {
      tileSize = 768;  // Medium tiles
    } else {
      tileSize = 512;  // Standard tiles for high zoom
    }

    this.tileSizeCache.set(scaleKey, tileSize);
    return tileSize;
  }

  getVisibleTiles(viewport, imageData) {
    const { x, y, scale, width, height } = viewport;
    
    // Create a hash of the viewport for caching
    const viewportHash = `${Math.round(x/10)}_${Math.round(y/10)}_${Math.round(scale*1000)}_${width}_${height}`;
    
    // Return cached result if viewport hasn't changed significantly
    if (this.lastViewportHash === viewportHash && this.visibleTilesCache.has(viewportHash)) {
      return this.visibleTilesCache.get(viewportHash);
    }
    
    // Get adaptive tile size based on current scale
    const tileSize = this.getAdaptiveTileSize(scale);
    
    // Minimal padding to reduce tile count
    const padding = tileSize * 0.05; // Reduced to 5% padding
    const visibleLeft = Math.max(0, (-x / scale) - padding);
    const visibleTop = Math.max(0, (-y / scale) - padding);
    const visibleRight = Math.min(imageData.width, ((-x + width) / scale) + padding);
    const visibleBottom = Math.min(imageData.height, ((-y + height) / scale) + padding);
    
    // Calculate core visible tile boundaries using adaptive tile size
    const startTileX = Math.floor(visibleLeft / tileSize);
    const startTileY = Math.floor(visibleTop / tileSize);
    const endTileX = Math.ceil(visibleRight / tileSize);
    const endTileY = Math.ceil(visibleBottom / tileSize);
    
    const tiles = this.getTilesWithPriority(startTileX, startTileY, endTileX, endTileY, imageData, tileSize, scale);
    
    // Cache the result
    this.visibleTilesCache.set(viewportHash, tiles);
    this.lastViewportHash = viewportHash;
    
    // Aggressive cache cleanup
    if (this.visibleTilesCache.size > 10) {
      this.visibleTilesCache.clear(); // Clear all cache to save memory
    }
    
    return tiles;
  }

  getTilesWithPriority(startX, startY, endX, endY, imageData, tileSize, scale) {
    const tiles = [];
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    
    // FIXED: Render ALL visible tiles + buffer for smooth UX
    // Add buffer around visible area for smooth scrolling
    const bufferTiles = 2; // 2 tiles buffer in each direction
    const bufferedStartX = Math.max(0, startX - bufferTiles);
    const bufferedStartY = Math.max(0, startY - bufferTiles);
    const bufferedEndX = Math.min(Math.ceil(imageData.width / tileSize), endX + bufferTiles);
    const bufferedEndY = Math.min(Math.ceil(imageData.height / tileSize), endY + bufferTiles);
    
    // No limits - render all visible + buffer tiles
    const actualStartX = bufferedStartX;
    const actualStartY = bufferedStartY;
    const actualEndX = bufferedEndX;
    const actualEndY = bufferedEndY;
    
    for (let tileY = actualStartY; tileY < actualEndY; tileY++) {
      for (let tileX = actualStartX; tileX < actualEndX; tileX++) {
        const pixelX = tileX * tileSize;
        const pixelY = tileY * tileSize;
        
        // Calculate priority based on distance from visible area
        const distance = Math.sqrt(Math.pow(tileX - centerX, 2) + Math.pow(tileY - centerY, 2));
        
        // Determine priority: visible tiles = immediate, buffer tiles = high
        let priority = this.priorityLevels.IMMEDIATE;
        if (tileX < startX || tileX >= endX || tileY < startY || tileY >= endY) {
          priority = this.priorityLevels.HIGH; // Buffer tiles
        }
        
        tiles.push({
          x: tileX,
          y: tileY,
          pixelX,
          pixelY,
          width: Math.min(tileSize, imageData.width - pixelX),
          height: Math.min(tileSize, imageData.height - pixelY),
          id: `${tileX}_${tileY}_${tileSize}`,
          priority,
          distance,
          bufferLevel: (tileX < startX || tileX >= endX || tileY < startY || tileY >= endY) ? 1 : 0,
          tileSize,
          scale
        });
      }
    }
    // Sort by distance from center
    tiles.sort((a, b) => a.distance - b.distance);
    
    return tiles;
  }
  
  calculateLevelOfDetail(scale) {
    // Optimized level calculation for better performance
    if (scale < 0.2) return 0; // Use low quality image
    if (scale < 0.8) return 1; // Transition zone
    return 2; // Use high quality image
  }
  
  calculateTilePriority(tileX, tileY, startX, startY, endX, endY) {
    // Calculate distance from center of visible area
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const distance = Math.sqrt(Math.pow(tileX - centerX, 2) + Math.pow(tileY - centerY, 2));
    return distance;
  }

  getTileUrl(tile, imageData) {
    // Generate URL for tile based on level of detail
    const level = tile.level;
    const baseName = imageData.originalPath.split('/').pop().split('.')[0];
    return `/tiles/${baseName}/level_${level}/${tile.id}.jpg`;
  }
  
  isInViewport(tile, viewport, imageData) {
    const tileScreenX = tile.pixelX * viewport.scale + viewport.x;
    const tileScreenY = tile.pixelY * viewport.scale + viewport.y;
    const tileScreenWidth = tile.width * viewport.scale;
    const tileScreenHeight = tile.height * viewport.scale;
    
    return !(
      tileScreenX + tileScreenWidth < 0 ||
      tileScreenY + tileScreenHeight < 0 ||
      tileScreenX > viewport.width ||
      tileScreenY > viewport.height
    );
  }
}

export default ViewportManager;
