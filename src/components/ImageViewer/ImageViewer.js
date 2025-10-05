import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDebouncedCallback } from 'use-debounce';
import SimpleTileManager from './SimpleTileManager';
import ViewportManager from './ViewportManager';
import Controls from './Controls';
import InfoPanel from './InfoPanel';
import StarMarkers from '../StarMarkers/StarMarkers';
import StarModal from '../StarModal/StarModal';

const ImageViewer = ({ selectedGalaxy }) => {
  const stageRef = useRef();
  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
    scale: 0.2,
    width: Math.floor(window.innerWidth - 400), // Full width minus left panel
    height: window.innerHeight
  });
  
  // Image data based on selected galaxy
  const imageData = useMemo(() => {
    if (selectedGalaxy) {
      return {
        width: 42208, // Default high-res dimensions
        height: 9870,
        originalPath: selectedGalaxy.filename,
        name: selectedGalaxy.name
      };
    }
    
    // Fallback to Andromeda
    return {
      width: 42208,
      height: 9870,
      originalPath: 'https://assets.science.nasa.gov/content/dam/science/missions/hubble/galaxies/andromeda/Hubble_M31Mosaic_2025_42208x9870_STScI-01JGY8MZB6RAYKZ1V4CHGN37Q6.jpg',
      name: 'Andromeda Galaxy'
    };
  }, [selectedGalaxy]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [debouncedViewport, setDebouncedViewport] = useState(viewport);
  const [isZooming, setIsZooming] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Star modal state
  const [selectedStar, setSelectedStar] = useState(null);
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);
  
  const viewportManager = useRef(new ViewportManager());
  const zoomTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport(prev => ({
        ...prev,
        width: Math.floor(window.innerWidth - 400), // Full width minus left panel
        height: window.innerHeight
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset viewport when galaxy changes
  useEffect(() => {
    if (selectedGalaxy) {
      setViewport(prev => ({
        ...prev,
        x: 0,
        y: 0,
        scale: 0.2
      }));
      setIsInitialLoading(true);
    }
  }, [selectedGalaxy?.id]);

  // Heavily optimized debounced viewport update
  const debouncedViewportUpdate = useDebouncedCallback(
    (newViewport) => {
      setDebouncedViewport(newViewport);
    },
    isDragging ? 50 : 100, // Much slower updates to reduce CPU load
    { leading: false, trailing: true }
  );

  // Simplified viewport handling - reduce CPU load
  useEffect(() => {
    const isScaleChange = Math.abs(viewport.scale - debouncedViewport.scale) > 0.01; // Larger threshold
    
    if (isScaleChange) {
      setIsZooming(true);
      setDebouncedViewport(viewport);
      
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      zoomTimeoutRef.current = setTimeout(() => {
        setIsZooming(false);
      }, 300); // Longer timeout
    } else {
      debouncedViewportUpdate(viewport);
    }

    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, [viewport.scale, viewport.x, viewport.y, debouncedViewportUpdate]); // Specific dependencies

  const animateZoom = useCallback((targetScale, targetX, targetY) => {
    const startScale = viewport.scale;
    const startX = viewport.x;
    const startY = viewport.y;
    const startTime = performance.now();
    const duration = 200;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out function
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setViewport({
        ...viewport,
        scale: startScale + (targetScale - startScale) * easeInOut,
        x: startX + (targetX - startX) * easeInOut,
        y: startY + (targetY - startY) * easeInOut,
        width: viewport.width,
        height: viewport.height
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [viewport]);

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.08;
    const stage = stageRef.current;
    const oldScale = viewport.scale;
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - viewport.x) / oldScale,
      y: (pointer.y - viewport.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(0.01, Math.min(3, newScale));
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    // Direct update without animation for mouse wheel
    setViewport({
      ...viewport,
      scale: clampedScale,
      x: newPos.x,
      y: newPos.y
    });
  }, [viewport]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    const pos = e.target.getStage().getPointerPosition();
    setDragStart({ x: pos.x - viewport.x, y: pos.y - viewport.y });
  }, [viewport]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const pos = e.target.getStage().getPointerPosition();
    setViewport({
      ...viewport,
      x: pos.x - dragStart.x,
      y: pos.y - dragStart.y
    });
  }, [isDragging, dragStart, viewport]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = useCallback((targetScale, targetX, targetY) => {
    animateZoom(targetScale, targetX, targetY);
  }, [animateZoom]);

  const handleZoomOut = useCallback((targetScale, targetX, targetY) => {
    animateZoom(targetScale, targetX, targetY);
  }, [animateZoom]);

  const handleReset = useCallback(() => {
    animateZoom(0.2, 0, 0);
  }, [animateZoom]);

  // Star interaction handlers
  const handleStarClick = useCallback((star) => {
    setSelectedStar(star);
    setIsStarModalOpen(true);
  }, []);

  const handleCloseStarModal = useCallback(() => {
    setIsStarModalOpen(false);
    setSelectedStar(null);
  }, []);

  // Removed unused functions - zoomIn, zoomOut, resetView
  // These are handled by the Controls component

  // Memoize visible tiles calculation for better performance
  const visibleTiles = useMemo(() => {
    return viewportManager.current.getVisibleTiles(debouncedViewport, imageData);
  }, [debouncedViewport, imageData]);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000); // Hide loading overlay after 1 second
    
    return () => clearTimeout(timer);
  }, []);

  // Show placeholder if no galaxy selected
  if (!selectedGalaxy) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--primary-bg)',
        color: 'var(--secondary-text)',
        fontFamily: 'var(--nasa-font)',
        fontSize: '1.2rem',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🌌</div>
          <div>Select a galaxy from the left panel to begin exploration</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Stage
        ref={stageRef}
        width={viewport.width}
        height={viewport.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        x={viewport.x}
        y={viewport.y}
      >
        <Layer>
          <SimpleTileManager
            tiles={visibleTiles}
            viewport={debouncedViewport}
            isZooming={isZooming}
            onInitialLoad={() => setIsInitialLoading(false)}
          />
        </Layer>
        
        {/* Star markers layer */}
        <Layer>
          <StarMarkers
            selectedGalaxy={selectedGalaxy}
            viewport={debouncedViewport}
            onStarClick={handleStarClick}
          />
        </Layer>
      </Stage>
      
      {isInitialLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: 'var(--primary-text)',
          fontFamily: 'var(--nasa-font)',
          fontSize: '1.2rem'
        }}>
          Loading {imageData.name}...
        </div>
      )}
      
      <Controls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        viewport={viewport}
      />
      
      <InfoPanel
        viewport={viewport}
        imageData={imageData}
        visibleTiles={visibleTiles}
      />
      
      {/* Star information modal */}
      <StarModal
        star={selectedStar}
        isOpen={isStarModalOpen}
        onClose={handleCloseStarModal}
      />
    </div>
  );
};

export default ImageViewer;
