import React, { useMemo, useState, useCallback } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { getStarsForGalaxy } from '../../data/starData';
import AnimatedPulse from './AnimatedPulse';

const StarMarkers = ({ selectedGalaxy, viewport, onStarClick }) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  
  // Get stars for the current galaxy
  const stars = useMemo(() => {
    if (!selectedGalaxy) return [];
    return getStarsForGalaxy(selectedGalaxy.id);
  }, [selectedGalaxy]);

  // Calculate which stars are visible in the current viewport
  const visibleStars = useMemo(() => {
    if (!stars.length || !viewport) return [];

    const { x, y, scale, width, height } = viewport;
    
    // Calculate the visible area in image coordinates
    const viewLeft = -x / scale;
    const viewTop = -y / scale;
    const viewRight = viewLeft + width / scale;
    const viewBottom = viewTop + height / scale;
    
    // Add some padding to show stars slightly outside the viewport
    const padding = 100 / scale;
    
    return stars.filter(star => {
      return star.x >= viewLeft - padding &&
             star.x <= viewRight + padding &&
             star.y >= viewTop - padding &&
             star.y <= viewBottom + padding;
    });
  }, [stars, viewport]);

  // Get star color based on type
  const getStarColor = (type) => {
    const colors = {
      'Red Giant': '#ff6b6b',
      'Red Supergiant': '#ff4757',
      'Blue Giant': '#3742fa',
      'Blue Supergiant': '#2f3542',
      'Yellow Dwarf': '#ffa502',
      'White Dwarf': '#f1f2f6',
      'Neutron Star': '#a4b0be',
      'Wolf-Rayet': '#ff3838',
      'Cepheid Variable': '#ffc048',
      'RR Lyrae Variable': '#ffb8b8',
      'O-type Star': '#70a1ff',
      'Luminous Blue Variable': '#4834d4',
      'Yellow Hypergiant': '#ffb142',
      'Binary System': '#ff9ff3',
      'Carbon Star': '#8b0000',
      'Be Star': '#00d2d3',
      'Magnetar': '#2c2c54',
      'Herbig Ae/Be Star': '#ff6348',
      'Horizontal Branch Star': '#feca57',
      'T Tauri Star': '#ff7675',
      'Mira Variable': '#fd79a8',
      'Subdwarf B Star': '#74b9ff',
      'Red Dwarf': '#e17055',
      'Blue Straggler': '#0984e3',
      'S-type Star': '#a29bfe',
      'Helium Star': '#6c5ce7',
      'Extreme Helium Star': '#fd79a8',
      'Lambda Bootis Star': '#fdcb6e',
      'RV Tauri Variable': '#e84393',
      'Ap Star': '#00b894',
      'Symbiotic Star': '#e17055',
      'Delta Scuti Variable': '#00cec9'
    };
    return colors[type] || '#ffa502';
  };

  // Calculate star size based on magnitude (brighter stars = larger markers)
  const getStarSize = (magnitude, scale) => {
    // Invert magnitude (lower magnitude = brighter = larger)
    const brightness = 10 - magnitude;
    const baseSize = Math.max(3, Math.min(12, brightness * 1.5));
    
    // Scale with zoom level but keep minimum and maximum sizes
    const scaledSize = baseSize / Math.sqrt(scale);
    return Math.max(4, Math.min(20, scaledSize));
  };

  // Calculate label visibility based on zoom level
  const shouldShowLabel = (scale) => {
    return scale > 0.5; // Only show labels when zoomed in enough
  };

  const handleStarClick = (star, e) => {
    e.cancelBubble = true; // Prevent event from bubbling to the stage
    onStarClick(star);
  };

  const handleStarMouseEnter = useCallback((star) => {
    setHoveredStar(star.id);
  }, []);

  const handleStarMouseLeave = useCallback(() => {
    setHoveredStar(null);
  }, []);

  if (!visibleStars.length) return null;

  return (
    <Group>
      {visibleStars.map((star) => {
        const starSize = getStarSize(star.magnitude, viewport.scale);
        const starColor = getStarColor(star.type);
        const showLabel = shouldShowLabel(viewport.scale);
        const isHovered = hoveredStar === star.id;
        
        // Enhanced sizes and effects when hovered
        const hoverMultiplier = isHovered ? 1.5 : 1;
        const glowRadius = starSize * 3 * hoverMultiplier;
        const mainRadius = starSize * hoverMultiplier;
        const coreRadius = starSize * 0.4 * hoverMultiplier;
        
        return (
          <Group key={star.id}>
            {/* Proximity detection area (invisible, larger hit area) */}
            <Circle
              x={star.x}
              y={star.y}
              radius={Math.max(starSize * 4, 30 / viewport.scale)} // Adaptive detection area
              fill="transparent"
              onMouseEnter={() => handleStarMouseEnter(star)}
              onMouseLeave={handleStarMouseLeave}
              onClick={(e) => handleStarClick(star, e)}
              cursor="pointer"
            />
            
            {/* Outer glow effect - enhanced when hovered */}
            <Circle
              x={star.x}
              y={star.y}
              radius={glowRadius}
              fill={starColor}
              opacity={isHovered ? 0.4 : 0.2}
              listening={false}
            />
            
            {/* Animated pulse ring */}
            <AnimatedPulse
              x={star.x}
              y={star.y}
              radius={starSize * 5}
              color="#ffffff"
              isActive={isHovered}
            />
            
            {/* Secondary hover ring */}
            {isHovered && (
              <Circle
                x={star.x}
                y={star.y}
                radius={starSize * 6}
                stroke={starColor}
                strokeWidth={1}
                opacity={0.4}
                listening={false}
              />
            )}
            
            {/* Main star marker */}
            <Circle
              x={star.x}
              y={star.y}
              radius={mainRadius}
              fill={starColor}
              stroke="#ffffff"
              strokeWidth={isHovered ? 2 : 1}
              opacity={isHovered ? 1 : 0.9}
              listening={false}
            />
            
            {/* Inner bright core */}
            <Circle
              x={star.x}
              y={star.y}
              radius={coreRadius}
              fill="#ffffff"
              opacity={isHovered ? 1 : 0.8}
              listening={false}
            />
            
            {/* Star name label (show on hover or when zoomed in) */}
            {(showLabel || isHovered) && (
              <Group>
                {/* Label background */}
                <Text
                  x={star.x + mainRadius + 8}
                  y={star.y - 10}
                  text={star.name}
                  fontSize={isHovered ? 14 / viewport.scale : 12 / viewport.scale}
                  fontFamily="var(--nasa-font)"
                  fill="#000000"
                  opacity={0.8}
                  offsetX={-2}
                  offsetY={-2}
                  listening={false}
                />
                
                {/* Label text */}
                <Text
                  x={star.x + mainRadius + 8}
                  y={star.y - 10}
                  text={star.name}
                  fontSize={isHovered ? 14 / viewport.scale : 12 / viewport.scale}
                  fontFamily="var(--nasa-font)"
                  fill="#ffffff"
                  opacity={1}
                  listening={false}
                />
                
                {/* Star type and magnitude on hover */}
                {isHovered && (
                  <>
                    {/* Star type */}
                    <Text
                      x={star.x + mainRadius + 8}
                      y={star.y + 5}
                      text={star.type}
                      fontSize={10 / viewport.scale}
                      fontFamily="var(--nasa-font)"
                      fill="#000000"
                      opacity={0.8}
                      offsetX={-1}
                      offsetY={-1}
                      listening={false}
                    />
                    <Text
                      x={star.x + mainRadius + 8}
                      y={star.y + 5}
                      text={star.type}
                      fontSize={10 / viewport.scale}
                      fontFamily="var(--nasa-font)"
                      fill={starColor}
                      opacity={1}
                      listening={false}
                    />
                    
                    {/* Magnitude info */}
                    <Text
                      x={star.x + mainRadius + 8}
                      y={star.y + 18}
                      text={`Magnitude: ${star.magnitude}`}
                      fontSize={8 / viewport.scale}
                      fontFamily="var(--nasa-font)"
                      fill="#000000"
                      opacity={0.7}
                      offsetX={-1}
                      offsetY={-1}
                      listening={false}
                    />
                    <Text
                      x={star.x + mainRadius + 8}
                      y={star.y + 18}
                      text={`Magnitude: ${star.magnitude}`}
                      fontSize={8 / viewport.scale}
                      fontFamily="var(--nasa-font)"
                      fill="#cccccc"
                      opacity={0.9}
                      listening={false}
                    />
                    
                    {/* Click hint */}
                    <Text
                      x={star.x + mainRadius + 8}
                      y={star.y + 30}
                      text="Click for details"
                      fontSize={7 / viewport.scale}
                      fontFamily="var(--nasa-font)"
                      fill="#000000"
                      opacity={0.6}
                      offsetX={-1}
                      offsetY={-1}
                      listening={false}
                    />
                    <Text
                      x={star.x + mainRadius + 8}
                      y={star.y + 30}
                      text="Click for details"
                      fontSize={7 / viewport.scale}
                      fontFamily="var(--nasa-font)"
                      fill="#888888"
                      opacity={0.8}
                      listening={false}
                    />
                  </>
                )}
              </Group>
            )}
          </Group>
        );
      })}
    </Group>
  );
};

export default StarMarkers;
