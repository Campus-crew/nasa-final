import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Image as KonvaImage, Rect } from 'react-konva';

// Simplified image system - automatic quality based on zoom
const IMAGES = {
  low: {
    id: 'low',
    name: 'Low Resolution',
    width: 10552,
    height: 2468,
    src: 'Hubble_M31Mosaic_2025_10552x2468_STScI-01JGY92V0Z2HJTVH605N4WH9XQ.jpg',
    zoomRange: [0, 0.4]
  },
  medium: {
    id: 'medium', 
    name: 'Medium Resolution',
    width: 5276,
    height: 1234,
    src: 'Hubble_M31Mosaic_2025_5276 X 1234_STScI-01JGY92V0Z2HJTVH605N4WH9XQ.jpg',
    zoomRange: [0.4, 1.0]
  },
  high: {
    id: 'high',
    name: 'High Resolution', 
    width: 42208,
    height: 9870,
    src: 'Hubble_M31Mosaic_2025_42208x9870_STScI-01JGY8MZB6RAYKZ1V4CHGN37Q6.jpg',
    zoomRange: [1.0, 3.0]
  }
};

const SimpleTileManager = React.memo(({ tiles, viewport, isZooming, onInitialLoad }) => {
  const [loadedTiles, setLoadedTiles] = useState(new Map());
  const [currentImageLevel, setCurrentImageLevel] = useState('low');
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [preloadingLevel, setPreloadingLevel] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageRefs = useRef({});
  const loadingRef = useRef(new Set());
  const lastScaleRef = useRef(viewport.scale);
  const maxConcurrentLoads = 12;
  const tileGenerationCache = useRef(new Map());
  const preloadTimeoutRef = useRef(null);

  // Updated image level determination - high quality loads earlier
  const getCurrentImageLevel = useCallback((scale) => {
    if (scale < 0.2) return 'low';     // Low: 0 - 0.2
    if (scale < 0.5) return 'medium';  // Medium: 0.2 - 0.5  
    return 'high';                     // High: 0.5+
  }, []);
  
  // Preload thresholds - start loading next level before we need it
  const getPreloadLevel = useCallback((scale) => {
    if (scale >= 0.15 && scale < 0.2) return 'medium'; // Preload medium at 0.15
    if (scale >= 0.4 && scale < 0.5) return 'high';    // Preload high at 0.4
    return null;
  }, []);
  // Get current image config
  const getCurrentImage = useCallback(() => {
    return IMAGES[currentImageLevel];
  }, [currentImageLevel]);

  // FIXED: Smart image loading - no unnecessary reloads
  useEffect(() => {
    const requiredLevel = getCurrentImageLevel(viewport.scale);
    const preloadLevel = getPreloadLevel(viewport.scale);
    
    // Function to load an image
    const loadImage = (level, isPreload = false) => {
      if (imageRefs.current[level]) return Promise.resolve(imageRefs.current[level]);
      
      const imageConfig = IMAGES[level];
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          imageRefs.current[level] = img;
          console.log(`${imageConfig.name} ${isPreload ? 'preloaded' : 'loaded'}:`, img.width, 'x', img.height);
          resolve(img);
        };
        img.onerror = reject;
        img.src = `/media/${imageConfig.src}`;
      });
    };
    
    // Load current level
    loadImage(requiredLevel).then(() => {
      // CRITICAL FIX: Only switch if level actually changed
      if (currentImageLevel !== requiredLevel) {
        console.log(`Switching to ${requiredLevel} at zoom ${viewport.scale.toFixed(3)}`);
        
        setIsTransitioning(true);
        setCurrentImageLevel(requiredLevel);
        
        // DON'T clear cache - this was causing black screens!
        // Let tiles regenerate naturally as needed
        
        // End transition quickly
        setTimeout(() => {
          setIsTransitioning(false);
        }, 150); // Reduced time
      }
      
      // Trigger initial load completion
      if (!isInitialLoadComplete && requiredLevel === 'low') {
        setIsInitialLoadComplete(true);
        if (onInitialLoad) {
          setTimeout(onInitialLoad, 100);
        }
      }
    }).catch(e => console.error(`Failed to load ${requiredLevel}:`, e));
    
    // Preload next level if needed
    if (preloadLevel && preloadLevel !== requiredLevel) {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
      
      // Delay preloading to not interfere with current loading
      preloadTimeoutRef.current = setTimeout(() => {
        setPreloadingLevel(preloadLevel);
        loadImage(preloadLevel, true).then(() => {
          console.log(`Preloaded ${preloadLevel} for smooth transition`);
          setPreloadingLevel(null);
        }).catch(e => {
          console.error(`Failed to preload ${preloadLevel}:`, e);
          setPreloadingLevel(null);
        });
      }, 200); // Small delay to prioritize current level
    }

    lastScaleRef.current = viewport.scale;
  }, [viewport.scale, getCurrentImageLevel, getPreloadLevel, currentImageLevel, isInitialLoadComplete, onInitialLoad]);
  // Removed complex prefetching - keep it simple

  // Optimized tile creation with memory management
  const createTile = useCallback((tile) => {
    const currentImage = imageRefs.current[currentImageLevel];
    if (!currentImage) return null;
    
    // Create canvas only when needed and clean up immediately
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for performance
    
    canvas.width = tile.width;
    canvas.height = tile.height;
    
    try {
      // Calculate scale ratio
      const scaleRatio = currentImage.width / 42208;
      
      const sourceX = tile.pixelX * scaleRatio;
      const sourceY = tile.pixelY * scaleRatio;
      const sourceWidth = tile.width * scaleRatio;
      const sourceHeight = tile.height * scaleRatio;
      
      // Clamp to image bounds
      const clampedSourceX = Math.max(0, Math.min(sourceX, currentImage.width - 1));
      const clampedSourceY = Math.max(0, Math.min(sourceY, currentImage.height - 1));
      const clampedSourceWidth = Math.min(sourceWidth, currentImage.width - clampedSourceX);
      const clampedSourceHeight = Math.min(sourceHeight, currentImage.height - clampedSourceY);
      
      ctx.drawImage(
        currentImage,
        clampedSourceX, clampedSourceY, clampedSourceWidth, clampedSourceHeight,
        0, 0, tile.width, tile.height
      );
      
      // Create image and immediately clean up canvas
      const tileImage = new Image();
      tileImage.src = canvas.toDataURL('image/jpeg', 0.7); // Lower quality for memory
      
      // CRITICAL: Clean up canvas immediately to prevent memory leak
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
      
      return tileImage;
    } catch (error) {
      console.error('Error creating tile:', error);
      // Clean up on error
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
      return null;
    }
  }, [currentImageLevel]);

  // COMPLETELY FIXED: Continuous distributed tile loading
  useEffect(() => {
    if (!imageRefs.current[currentImageLevel] || !tiles.length) return;
    
    const levelPrefix = currentImageLevel;
    let loadQueue = [];
    
    // Build load queue with priorities
    tiles.forEach((tile) => {
      const tileId = `${levelPrefix}_${tile.id}`;
      const baseTileId = tile.id;
      
      // Skip if already loaded or loading
      if (loadedTiles.has(tileId) || loadingRef.current.has(tileId)) return;
      
      // Check cache first
      const cachedTile = tileGenerationCache.current.get(`${levelPrefix}_${baseTileId}`);
      if (cachedTile) {
        setLoadedTiles(prev => {
          if (prev.has(tileId)) return prev;
          const newMap = new Map(prev);
          newMap.set(tileId, cachedTile);
          return newMap;
        });
        return;
      }
      
      loadQueue.push({ tile, tileId, baseTileId });
    });
    
    // CRITICAL FIX: Distributed loading - process queue continuously
    const processQueue = () => {
      if (loadQueue.length === 0) return;
      if (loadingRef.current.size >= maxConcurrentLoads) {
        // Retry in 50ms if queue is full
        setTimeout(processQueue, 50);
        return;
      }
      
      const { tile, tileId, baseTileId } = loadQueue.shift();
      loadingRef.current.add(tileId);
      
      const tileImage = createTile(tile);
      if (tileImage) {
        tileImage.onload = () => {
          // Cache with size limit
          if (tileGenerationCache.current.size < 200) {
            tileGenerationCache.current.set(`${levelPrefix}_${baseTileId}`, tileImage);
          }
          
          setLoadedTiles(prev => {
            if (prev.has(tileId)) {
              loadingRef.current.delete(tileId);
              return prev;
            }
            const newMap = new Map(prev);
            newMap.set(tileId, tileImage);
            return newMap;
          });
          loadingRef.current.delete(tileId);
          
          // Continue processing queue
          setTimeout(processQueue, 10); // Small delay between tiles
        };
        tileImage.onerror = () => {
          loadingRef.current.delete(tileId);
          setTimeout(processQueue, 10);
        };
      } else {
        loadingRef.current.delete(tileId);
        setTimeout(processQueue, 10);
      }
    };
    
    // Start processing immediately and continuously
    processQueue();
    
  }, [tiles, currentImageLevel, createTile]);
  
  // ADDITIONAL FIX: Continuous background loading even without movement
  useEffect(() => {
    if (!imageRefs.current[currentImageLevel]) return;
    
    const continuousLoadingInterval = setInterval(() => {
      const levelPrefix = currentImageLevel;
      
      // Find any unloaded tiles
      const unloadedTiles = tiles.filter(tile => {
        const tileId = `${levelPrefix}_${tile.id}`;
        return !loadedTiles.has(tileId) && !loadingRef.current.has(tileId);
      });
      
      if (unloadedTiles.length > 0 && loadingRef.current.size < maxConcurrentLoads) {
        // Load one more tile
        const tile = unloadedTiles[0];
        const tileId = `${levelPrefix}_${tile.id}`;
        const baseTileId = tile.id;
        
        loadingRef.current.add(tileId);
        
        const tileImage = createTile(tile);
        if (tileImage) {
          tileImage.onload = () => {
            if (tileGenerationCache.current.size < 200) {
              tileGenerationCache.current.set(`${levelPrefix}_${baseTileId}`, tileImage);
            }
            
            setLoadedTiles(prev => {
              if (prev.has(tileId)) {
                loadingRef.current.delete(tileId);
                return prev;
              }
              const newMap = new Map(prev);
              newMap.set(tileId, tileImage);
              return newMap;
            });
            loadingRef.current.delete(tileId);
          };
          tileImage.onerror = () => {
            loadingRef.current.delete(tileId);
          };
        } else {
          loadingRef.current.delete(tileId);
        }
      }
    }, 100); // Check every 100ms for new tiles to load
    
    return () => clearInterval(continuousLoadingInterval);
  }, [tiles, currentImageLevel, createTile, loadedTiles]);

  // ULTRA-GENTLE memory cleanup - maximum stability
  useEffect(() => {
    const currentTileIds = new Set(tiles.map(tile => `${currentImageLevel}_${tile.id}`));
    
    // Only cleanup if we have WAY too many tiles (prevent black screens completely)
    if (loadedTiles.size > 300) {
      setLoadedTiles(prev => {
        const newMap = new Map();
        let keptCount = 0;
        
        // Keep ALL current tiles first
        for (const [tileId, image] of prev) {
          const isCurrentTile = currentTileIds.has(tileId);
          const isCurrentLevel = tileId.startsWith(currentImageLevel);
          
          if (isCurrentTile) {
            newMap.set(tileId, image);
            keptCount++;
          } else if (isCurrentLevel && keptCount < 200) {
            // Keep many extra tiles from current level
            newMap.set(tileId, image);
            keptCount++;
          } else if (keptCount < 250) {
            // Keep many tiles from other levels for smooth transitions
            newMap.set(tileId, image);
            keptCount++;
          } else {
            // Only clean up if we absolutely must
            if (image && image.src) {
              image.src = '';
            }
          }
        }
        return newMap;
      });
    }
    
    // Very gentle cache cleanup
    if (tileGenerationCache.current.size > 400) {
      const entries = Array.from(tileGenerationCache.current.entries());
      tileGenerationCache.current.clear();
      // Keep most entries
      entries.slice(-200).forEach(([key, value]) => {
        tileGenerationCache.current.set(key, value);
      });
    }
  }, [tiles, currentImageLevel, loadedTiles.size]);

  // Comprehensive cleanup effect
  useEffect(() => {
    return () => {
      // Clear all loading states
      loadingRef.current.clear();
      
      // Clear preload timeout
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
      
      // Clear and clean up all cached tiles
      for (const [key, image] of tileGenerationCache.current) {
        if (image && image.src) {
          image.src = ''; // Clear image data
        }
      }
      tileGenerationCache.current.clear();
      
      // Clear loaded tiles
      setLoadedTiles(prev => {
        for (const [key, image] of prev) {
          if (image && image.src) {
            image.src = ''; // Clear image data
          }
        }
        return new Map();
      });
      
      // Clear image references
      imageRefs.current = {};
    };
  }, []);

  // Enhanced rendering with smooth transitions
  const renderedTiles = useMemo(() => {
    return tiles.map(tile => {
      const levelTileId = `${currentImageLevel}_${tile.id}`;
      const currentImage = loadedTiles.get(levelTileId);
      
      // Try to find fallback image from other levels during transition
      let fallbackImage = null;
      let fallbackOpacity = 0.7;
      
      if (!currentImage || !currentImage.complete) {
        // Look for tiles from other levels as fallback
        const otherLevels = ['low', 'medium', 'high'].filter(level => level !== currentImageLevel);
        for (const level of otherLevels) {
          const fallbackTileId = `${level}_${tile.id}`;
          const fallbackCandidate = loadedTiles.get(fallbackTileId);
          if (fallbackCandidate && fallbackCandidate.complete) {
            fallbackImage = fallbackCandidate;
            fallbackOpacity = isTransitioning ? 0.8 : 0.6; // Higher opacity during transition
            break;
          }
        }
      }
      
      // Render current image if available
      if (currentImage && currentImage.complete) {
        return (
          <KonvaImage
            key={levelTileId}
            x={tile.pixelX}
            y={tile.pixelY}
            width={tile.width}
            height={tile.height}
            image={currentImage}
            opacity={1}
            perfectDrawEnabled={false}
            listening={false}
          />
        );
      }
      
      // Render fallback image if available
      if (fallbackImage) {
        return (
          <KonvaImage
            key={`fallback-${levelTileId}`}
            x={tile.pixelX}
            y={tile.pixelY}
            width={tile.width}
            height={tile.height}
            image={fallbackImage}
            opacity={fallbackOpacity}
            perfectDrawEnabled={false}
            listening={false}
          />
        );
      }
      
      // Minimal loading state - almost invisible
      return (
        <Rect
          key={`loading-${levelTileId}`}
          x={tile.pixelX}
          y={tile.pixelY}
          width={tile.width}
          height={tile.height}
          fill="#050505"
          opacity={0.02}
        />
      );
    });
  }, [tiles, loadedTiles, currentImageLevel, isTransitioning]);

  return <>{renderedTiles}</>;
});

// Add display name for debugging
SimpleTileManager.displayName = 'SimpleTileManager';

export default SimpleTileManager;
