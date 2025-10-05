import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image as KonvaImage, Rect } from 'react-konva';
import ProgressiveImageLoader from './ProgressiveImageLoader';

const TileManager = ({ tiles, viewport, imageData }) => {
  const [loadedTiles, setLoadedTiles] = useState(new Map());
  const [loadingTiles, setLoadingTiles] = useState(new Set());
  const progressiveLoader = useRef(new ProgressiveImageLoader());
  const tileCache = useRef(new Map());


  const loadTile = useCallback(async (tile) => {
    const tileId = tile.id;
    
    // Check cache first
    if (tileCache.current.has(tileId)) {
      const cachedTile = tileCache.current.get(tileId);
      setLoadedTiles(prev => new Map(prev).set(tileId, cachedTile));
      return;
    }

    if (loadingTiles.has(tileId)) {
      return; // Already loading
    }

    setLoadingTiles(prev => new Set(prev).add(tileId));

    try {
      const image = await progressiveLoader.current.createTileFromCoordinates(tile, viewport.scale);
      
      // Cache the tile
      tileCache.current.set(tileId, image);
      setLoadedTiles(prev => new Map(prev).set(tileId, image));
    } catch (error) {
      console.error(`Failed to load tile ${tileId}:`, error);
    } finally {
      setLoadingTiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(tileId);
        return newSet;
      });
    }
  }, [viewport.scale, loadingTiles]);

  useEffect(() => {
    // Optimized tile loading with priority system
    const tilesToLoad = tiles.filter(tile => {
      const tileId = tile.id;
      return !loadedTiles.has(tileId) && !loadingTiles.has(tileId) && !tileCache.current.has(tileId);
    });

    if (tilesToLoad.length === 0) return;

    // Reduce batch size and increase delay for better performance
    const batchSize = 3;
    let currentBatch = 0;

    const loadBatch = () => {
      const start = currentBatch * batchSize;
      const end = Math.min(start + batchSize, tilesToLoad.length);
      
      // Load high priority tiles first (already sorted by ViewportManager)
      for (let i = start; i < end; i++) {
        loadTile(tilesToLoad[i]);
      }
      
      currentBatch++;
      
      // Increase delay between batches to reduce lag
      if (end < tilesToLoad.length) {
        setTimeout(loadBatch, 100);
      }
    };

    // Start loading with a small delay to allow UI to update
    setTimeout(loadBatch, 16);
  }, [tiles, loadedTiles, loadingTiles, loadTile]);

  // Clean up old tiles when viewport changes significantly
  useEffect(() => {
    const maxCacheSize = 50;
    if (tileCache.current.size > maxCacheSize) {
      const entries = Array.from(tileCache.current.entries());
      const toDelete = entries.slice(0, entries.length - maxCacheSize);
      toDelete.forEach(([key]) => {
        tileCache.current.delete(key);
        setLoadedTiles(prev => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      });
    }
  }, [viewport.scale]);

  const renderTile = (tile) => {
    const tileId = tile.id;
    const image = loadedTiles.get(tileId);
    const isLoading = loadingTiles.has(tileId);

    if (image) {
      return (
        <KonvaImage
          key={tileId}
          x={tile.pixelX}
          y={tile.pixelY}
          width={tile.width}
          height={tile.height}
          image={image}
        />
      );
    }

    if (isLoading) {
      return (
        <Rect
          key={`loading-${tileId}`}
          x={tile.pixelX}
          y={tile.pixelY}
          width={tile.width}
          height={tile.height}
          fill="rgba(100, 100, 100, 0.3)"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={1}
        />
      );
    }

    return null;
  };

  return (
    <>
      {tiles.map(renderTile)}
    </>
  );
};

export default TileManager;
