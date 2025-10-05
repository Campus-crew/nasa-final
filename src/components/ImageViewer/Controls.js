import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--secondary-bg);
    border-color: var(--accent-text);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Controls = ({ onZoomIn, onZoomOut, onReset, viewport }) => {
  const handleZoomIn = () => {
    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    const mousePointTo = {
      x: (centerX - viewport.x) / viewport.scale,
      y: (centerY - viewport.y) / viewport.scale,
    };
    
    const newScale = Math.min(3, viewport.scale * 1.5);
    const newPos = {
      x: centerX - mousePointTo.x * newScale,
      y: centerY - mousePointTo.y * newScale,
    };
    
    onZoomIn(newScale, newPos.x, newPos.y);
  };

  const handleZoomOut = () => {
    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    const mousePointTo = {
      x: (centerX - viewport.x) / viewport.scale,
      y: (centerY - viewport.y) / viewport.scale,
    };
    
    const newScale = Math.max(0.01, viewport.scale / 1.5);
    const newPos = {
      x: centerX - mousePointTo.x * newScale,
      y: centerY - mousePointTo.y * newScale,
    };
    
    onZoomOut(newScale, newPos.x, newPos.y);
  };

  return (
    <ControlsContainer>
      <ControlButton onClick={handleZoomIn} title="Zoom In">
        +
      </ControlButton>
      <ControlButton onClick={handleZoomOut} title="Zoom Out">
        −
      </ControlButton>
      <ControlButton onClick={onReset} title="Reset View">
        ⌂
      </ControlButton>
    </ControlsContainer>
  );
};

export default Controls;
