import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SelectorContainer = styled.div`
  width: 100%;
`;

const SelectorTitle = styled.h3`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
`;

const GalaxyGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const GalaxyCard = styled(motion.div)`
  background: ${props => props.isSelected ? 'var(--tertiary-bg)' : 'var(--secondary-bg)'};
  border: 1px solid ${props => props.isSelected ? 'var(--accent-text)' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  padding: 0.75rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: var(--accent-text);
    background: var(--tertiary-bg);
  }
`;

const GalaxyImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: calc(var(--border-radius) / 2);
  flex-shrink: 0;
`;

const GalaxyInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const GalaxyName = styled.h4`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const GalaxyMeta = styled.p`
  font-family: var(--nasa-font);
  color: var(--tertiary-text);
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.2;
`;

const LoadingText = styled.p`
  font-family: var(--nasa-font);
  color: var(--secondary-text);
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;

const ErrorText = styled.p`
  font-family: var(--nasa-font);
  color: #ff6b6b;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;

const GalaxySelector = ({ onGalaxySelect, selectedGalaxy }) => {
  const [galaxies, setGalaxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGalaxies();
  }, []);

  const loadGalaxies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load metadata first
      const response = await fetch('/media/galaxies/galaxies_metadata.json');
      
      if (!response.ok) {
        throw new Error('Galaxies metadata not found. Run "npm run download-galaxies" first.');
      }

      const metadata = await response.json();
      
      // Filter and prepare galaxy data
      const galaxyData = metadata
        .filter(item => item.filename) // Only items with downloaded files
        .slice(0, 12) // Limit to 12 for UI
        .map(item => ({
          id: item.nasaId,
          name: item.title,
          filename: item.filename,
          description: item.description,
          imageUrl: `/media/galaxies/${item.filename}`,
          thumbnailUrl: `/media/galaxies/${item.filename}`, // Use same for now
          center: item.center,
          dateCreated: item.dateCreated
        }));

      setGalaxies(galaxyData);
      
      // Auto-select first galaxy if none selected
      if (galaxyData.length > 0 && !selectedGalaxy) {
        onGalaxySelect(galaxyData[0]);
      }

    } catch (err) {
      console.error('Error loading galaxies:', err);
      setError(err.message);
      
      // Fallback to Andromeda if no galaxies available
      const fallbackGalaxy = {
        id: 'andromeda-fallback',
        name: 'Andromeda Galaxy (Hubble)',
        filename: 'Hubble_M31Mosaic_2025_42208x9870_STScI-01JGY8MZB6RAYKZ1V4CHGN37Q6.jpg',
        description: 'The Andromeda Galaxy, our nearest major galactic neighbor.',
        imageUrl: '/media/galaxies/Hubble_M31Mosaic_2025_42208x9870_STScI-01JGY8MZB6RAYKZ1V4CHGN37Q6.jpg',
        thumbnailUrl: '/media/galaxies/Hubble_M31Mosaic_2025_42208x9870_STScI-01JGY8MZB6RAYKZ1V4CHGN37Q6.jpg'
      };
      
      setGalaxies([fallbackGalaxy]);
      if (!selectedGalaxy) {
        onGalaxySelect(fallbackGalaxy);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGalaxyClick = (galaxy) => {
    onGalaxySelect(galaxy);
  };

  if (loading) {
    return (
      <SelectorContainer>
        <SelectorTitle>Available Galaxies</SelectorTitle>
        <LoadingText>Loading available galaxies...</LoadingText>
      </SelectorContainer>
    );
  }

  return (
    <SelectorContainer>
      <SelectorTitle>Available Galaxies</SelectorTitle>
      
      {error && (
        <ErrorText>{error}</ErrorText>
      )}
      
      <GalaxyGrid>
        {galaxies.map((galaxy, index) => (
          <GalaxyCard
            key={galaxy.id}
            isSelected={selectedGalaxy?.id === galaxy.id}
            onClick={() => handleGalaxyClick(galaxy)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <GalaxyImage 
              src={galaxy.thumbnailUrl} 
              alt={galaxy.name}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZmlsbD0iIzY2NiIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2FsYXh5PC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            <GalaxyInfo>
              <GalaxyName>{galaxy.name}</GalaxyName>
              <GalaxyMeta>{galaxy.center || 'NASA'} • {galaxy.dateCreated?.split('-')[0] || '2023'}</GalaxyMeta>
            </GalaxyInfo>
          </GalaxyCard>
        ))}
      </GalaxyGrid>
    </SelectorContainer>
  );
};

export default GalaxySelector;
