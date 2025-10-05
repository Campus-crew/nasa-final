import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import GalaxySelector from '../../components/GalaxySelector/GalaxySelector';

const PageContainer = styled.div`
  height: 100vh;
  background: var(--primary-bg);
  display: flex;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: 400px;
  background: var(--primary-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;


const Title = styled.h1`
  font-family: var(--nasa-font);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary-text);
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-family: var(--nasa-font);
  color: var(--secondary-text);
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;
`;

const RightPanel = styled.div`
  flex: 1;
  background: var(--primary-bg);
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const GalaxySelectorContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const InfoSection = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--secondary-bg);
`;

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const InfoTitle = styled.h3`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 700;
`;

const InfoText = styled.p`
  font-family: var(--nasa-font);
  color: var(--secondary-text);
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
`;

const GalaxyInfo = styled.div`
  background: var(--tertiary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 0;
`;

const GalaxyTitle = styled.h4`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const GalaxyDescription = styled.p`
  font-family: var(--nasa-font);
  color: var(--secondary-text);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  color: var(--primary-text);
  text-decoration: none;
  font-family: var(--nasa-font);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  margin-bottom: 1rem;

  &:hover {
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
  }
`;

const MapAndromeda = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);

  const handleGalaxySelect = (galaxy) => {
    setSelectedGalaxy(galaxy);
  };

  return (
    <PageContainer>
      <LeftPanel>
        <Header>
          <BackButton to="/">← Back to Home</BackButton>
          <Title>Galaxy Explorer</Title>
          <Subtitle>Select and explore high-resolution galaxy images</Subtitle>
        </Header>

        <GalaxySelectorContainer>
          <GalaxySelector 
            onGalaxySelect={handleGalaxySelect}
            selectedGalaxy={selectedGalaxy}
          />
          
          {selectedGalaxy && (
            <GalaxyInfo>
              <GalaxyTitle>{selectedGalaxy.name}</GalaxyTitle>
              <GalaxyDescription>{selectedGalaxy.description}</GalaxyDescription>
            </GalaxyInfo>
          )}
        </GalaxySelectorContainer>

        <InfoSection>
          <InfoTitle>Navigation Controls</InfoTitle>
          <InfoText>• Mouse wheel: Zoom in/out</InfoText>
          <InfoText>• Click & drag: Pan around</InfoText>
          <InfoText>• Zoom buttons: Smooth zoom</InfoText>
          <InfoText>• Progressive loading for optimal performance</InfoText>
        </InfoSection>
      </LeftPanel>

      <RightPanel>
        <ViewerContainer>
          <ImageViewer selectedGalaxy={selectedGalaxy} />
        </ViewerContainer>
      </RightPanel>
    </PageContainer>
  );
};

export default MapAndromeda;
