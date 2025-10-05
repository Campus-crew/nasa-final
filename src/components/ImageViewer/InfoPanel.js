import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  min-width: 250px;
  backdrop-filter: blur(10px);
`;

const InfoItem = styled.div`
  color: var(--secondary-text);
  font-family: var(--nasa-font);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: var(--tertiary-text);
`;

const InfoValue = styled.span`
  color: var(--primary-text);
  font-weight: 500;
`;

const InfoPanel = ({ viewport, imageData, visibleTiles }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const getVisibleArea = () => {
    const visibleWidth = viewport.width / viewport.scale;
    const visibleHeight = viewport.height / viewport.scale;
    return {
      width: Math.min(visibleWidth, imageData.width),
      height: Math.min(visibleHeight, imageData.height)
    };
  };

  const visibleArea = getVisibleArea();
  const zoomPercentage = Math.round(viewport.scale * 100);

  return (
    <InfoContainer>
      <InfoItem>
        <InfoLabel>Image Size:</InfoLabel>
        <InfoValue>{formatNumber(imageData.width)} × {formatNumber(imageData.height)} px</InfoValue>
      </InfoItem>
      <InfoItem>
        <InfoLabel>Zoom:</InfoLabel>
        <InfoValue>{zoomPercentage}%</InfoValue>
      </InfoItem>
      <InfoItem>
        <InfoLabel>Position:</InfoLabel>
        <InfoValue>({formatNumber(-viewport.x / viewport.scale)}, {formatNumber(-viewport.y / viewport.scale)})</InfoValue>
      </InfoItem>
      <InfoItem>
        <InfoLabel>Visible Area:</InfoLabel>
        <InfoValue>{formatNumber(visibleArea.width)} × {formatNumber(visibleArea.height)} px</InfoValue>
      </InfoItem>
      <InfoItem>
        <InfoLabel>Active Tiles:</InfoLabel>
        <InfoValue>{visibleTiles.length}</InfoValue>
      </InfoItem>
      <InfoItem>
        <InfoLabel>Scale:</InfoLabel>
        <InfoValue>{viewport.scale.toFixed(3)}</InfoValue>
      </InfoItem>
    </InfoContainer>
  );
};

export default InfoPanel;
