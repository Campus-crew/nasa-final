class ProgressiveImageLoader {
  constructor() {
    this.imageCache = new Map();
    this.loadingPromises = new Map();
    this.qualityLevels = {
      low: '/media/Hubble_M31Mosaic_2025_10552x2468_STScI-01JGY92V0Z2HJTVH605N4WH9XQ.jpg',
      high: 'https://assets.science.nasa.gov/content/dam/science/missions/hubble/galaxies/andromeda/Hubble_M31Mosaic_2025_42208x9870_STScI-01JGY8MZB6RAYKZ1V4CHGN37Q6.jpg'
    };
    this.imageDimensions = {
      low: { width: 10552, height: 2468 },
      high: { width: 42208, height: 9870 }
    };
  }

  async loadImageLevel(quality) {
    const cacheKey = `image_${quality}`;
    
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey);
    }

    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(cacheKey, img);
        this.loadingPromises.delete(cacheKey);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(cacheKey);
        reject(new Error(`Failed to load ${quality} quality image`));
      };
      img.src = `/media/${this.qualityLevels[quality]}`;
    });

    this.loadingPromises.set(cacheKey, loadPromise);
    return loadPromise;
  }

  getQualityForScale(scale) {
    // Transition thresholds
    if (scale < 0.3) return 'low';
    return 'high';
  }

  async createTileFromCoordinates(tile, scale) {
    const quality = this.getQualityForScale(scale);
    const nextQuality = scale < 0.3 ? 'high' : 'low';
    
    try {
      // Load primary quality
      const primaryImage = await this.loadImageLevel(quality);
      const primaryDimensions = this.imageDimensions[quality];
      
      // Calculate scale ratio between qualities
      const scaleRatio = quality === 'low' 
        ? this.imageDimensions.high.width / this.imageDimensions.low.width
        : 1;

      // Create canvas for the tile
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = tile.width;
      canvas.height = tile.height;
      
      // Calculate source coordinates for primary image
      const sourceX = tile.pixelX / scaleRatio;
      const sourceY = tile.pixelY / scaleRatio;
      const sourceWidth = tile.width / scaleRatio;
      const sourceHeight = tile.height / scaleRatio;
      
      // Draw primary image
      ctx.drawImage(
        primaryImage,
        Math.max(0, sourceX),
        Math.max(0, sourceY),
        Math.min(sourceWidth, primaryDimensions.width - sourceX),
        Math.min(sourceHeight, primaryDimensions.height - sourceY),
        0, 0, tile.width, tile.height
      );

      // Progressive loading: preload next quality in background
      if (scale > 0.25 && scale < 0.35 && quality === 'low') {
        // Transition zone - start loading high quality
        this.loadImageLevel('high').catch(() => {
          // Ignore errors for background loading
        });
      }

      // Create tile image
      const tileImage = new Image();
      return new Promise((resolve) => {
        tileImage.onload = () => resolve(tileImage);
        tileImage.src = canvas.toDataURL('image/jpeg', 0.85);
      });

    } catch (error) {
      console.warn(`Failed to create tile: ${error.message}`);
      return this.createPlaceholderTile(tile);
    }
  }

  createPlaceholderTile(tile) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = tile.width;
    canvas.height = tile.height;
    
    // Create a simple gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, tile.width, tile.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, tile.width, tile.height);
    
    const tileImage = new Image();
    return new Promise((resolve) => {
      tileImage.onload = () => resolve(tileImage);
      tileImage.src = canvas.toDataURL();
    });
  }

  clearCache() {
    this.imageCache.clear();
    this.loadingPromises.clear();
  }
}

export default ProgressiveImageLoader;
