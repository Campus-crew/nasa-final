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

const InfoText = styled.p`
  font-family: var(--nasa-font);
  color: var(--secondary-text);
  font-size: 0.8rem;
  margin: 0.5rem 0;
  text-align: center;
  line-height: 1.4;
`;

const CodeText = styled.code`
  background: var(--tertiary-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--accent-text);
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
      let metadata = null;
      try {
        const response = await fetch('/media/galaxies/galaxies_metadata.json');
        
        if (response.ok) {
          // Check if response is actually JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            metadata = await response.json();
          }
        }
      } catch (fetchError) {
        console.log('Metadata file not found, using fallback galaxies');
      }

      // If we have metadata, use it
      if (metadata && Array.isArray(metadata) && metadata.length > 0) {
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
      } else {
        // Use fallback galaxies if no metadata found
        throw new Error('Using fallback galaxy images from NASA API');
      }

    } catch (err) {
      console.log('Loading fallback galaxies:', err.message);
      // Don't show error to user - fallback mode is normal
      setError(null);
      
      // Provide multiple fallback galaxies with working NASA images
      const fallbackGalaxies = [
        {
          id: 'andromeda-fallback',
          name: 'Andromeda Galaxy (M31)',
          filename: 'andromeda_placeholder.jpg',
          description: 'The Andromeda Galaxy, also known as M31, is our nearest major galactic neighbor at 2.5 million light-years away.',
          imageUrl: 'https://apod.nasa.gov/apod/image/1909/M31_HubblePhat_1080.jpg',
          thumbnailUrl: 'https://apod.nasa.gov/apod/image/1909/M31_HubblePhat_1080.jpg'
        },
        {
          id: 'whirlpool-fallback',
          name: 'Whirlpool Galaxy (M51)',
          filename: 'whirlpool_placeholder.jpg',
          description: 'The Whirlpool Galaxy is a classic spiral galaxy located 23 million light-years away in the constellation Canes Venatici.',
          imageUrl: 'https://apod.nasa.gov/apod/image/2104/M51_HubbleEsoGendler_1280.jpg',
          thumbnailUrl: 'https://apod.nasa.gov/apod/image/2104/M51_HubbleEsoGendler_1280.jpg'
        },
        {
          id: 'sombrero-fallback',
          name: 'Sombrero Galaxy (M104)',
          filename: 'sombrero_placeholder.jpg',
          description: 'The Sombrero Galaxy is a peculiar galaxy with a prominent dust lane, located 28 million light-years away.',
          imageUrl: 'https://apod.nasa.gov/apod/image/0305/sombrero_hst_big.jpg',
          thumbnailUrl: 'https://apod.nasa.gov/apod/image/0305/sombrero_hst_big.jpg'
        },
        {
          id: 'pinwheel-fallback',
          name: 'Pinwheel Galaxy (M101)',
          filename: 'pinwheel_placeholder.jpg',
          description: 'The Pinwheel Galaxy is a face-on spiral galaxy located 21 million light-years away in the constellation Ursa Major.',
          imageUrl: 'https://apod.nasa.gov/apod/image/1108/m101_hst_3000.jpg',
          thumbnailUrl: 'https://apod.nasa.gov/apod/image/1108/m101_hst_3000.jpg'
        },
        {
          id: 'cartwheel-fallback',
          name: 'Cartwheel Galaxy',
          filename: 'cartwheel_placeholder.jpg',
          description: 'The Cartwheel Galaxy is a lenticular ring galaxy located about 500 million light-years away.',
          imageUrl: 'https://apod.nasa.gov/apod/image/2208/CartwheelGalaxy_Webb.jpg',
          thumbnailUrl: 'https://apod.nasa.gov/apod/image/2208/CartwheelGalaxy_Webb.jpg'
        }
      ];
      
      setGalaxies(fallbackGalaxies);
      if (!selectedGalaxy) {
        onGalaxySelect(fallbackGalaxies[0]);
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
        <>
          <ErrorText>{error}</ErrorText>
          <InfoText>
            To download high-resolution galaxy images, run:<br/>
            <CodeText>npm run download-galaxies</CodeText>
          </InfoText>
        </>
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
                // Fallback to a better placeholder if image fails to load
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0iZ2FsYXh5R3JhZGllbnQiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjY2ZmYiIHN0b3Atb3BhY2l0eT0iMC44Ii8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjNDQ0NGNjIiBzdG9wLW9wYWNpdHk9IjAuNiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyMjIyNDQiIHN0b3Atb3BhY2l0eT0iMC4yIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMTExIiByeD0iOCIvPgo8ZWxsaXBzZSBjeD0iMzAiIGN5PSIzMCIgcng9IjIwIiByeT0iMTIiIGZpbGw9InVybCgjZ2FsYXh5R3JhZGllbnQpIiB0cmFuc2Zvcm09InJvdGF0ZSgtMzAgMzAgMzApIi8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSI0NSIgY3k9IjIwIiByPSIwLjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjQ1IiByPSIwLjgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNyIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQ1IiByPSIwLjYiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4K';
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
