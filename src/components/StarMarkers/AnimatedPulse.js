import React, { useEffect, useRef } from 'react';
import { Circle } from 'react-konva';

const AnimatedPulse = ({ x, y, radius, color, isActive }) => {
  const circleRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    if (!isActive || !circleRef.current) return;

    const circle = circleRef.current;
    let startTime = null;
    const duration = 2000; // 2 seconds

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;

      // Create a pulsing effect
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.3;
      const opacity = 0.3 + Math.sin(progress * Math.PI * 2) * 0.2;

      circle.scaleX(scale);
      circle.scaleY(scale);
      circle.opacity(opacity);

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <Circle
      ref={circleRef}
      x={x}
      y={y}
      radius={radius}
      stroke={color}
      strokeWidth={2}
      listening={false}
    />
  );
};

export default AnimatedPulse;
