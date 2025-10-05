import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--secondary-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);

  &:hover {
    background: var(--secondary-bg);
    color: var(--primary-text);
  }
`;

const StarName = styled.h2`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const StarType = styled.div`
  display: inline-block;
  background: var(--accent-bg);
  color: var(--accent-text);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--nasa-font);
`;

const ModalBody = styled.div`
  padding: 1.5rem 2rem 2rem 2rem;
`;

const Description = styled.p`
  font-family: var(--nasa-font);
  color: var(--secondary-text);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PropertySection = styled.div`
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const PropertyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled.span`
  font-family: var(--nasa-font);
  color: var(--tertiary-text);
  font-size: 0.9rem;
  font-weight: 500;
`;

const PropertyValue = styled.span`
  font-family: var(--nasa-font);
  color: var(--primary-text);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
`;

const StarIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => getStarColor(props.type)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem auto;
  box-shadow: 0 0 20px ${props => getStarColor(props.type)}40;
`;

// Helper function to get star color based on type
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

const getStarEmoji = (type) => {
  const emojis = {
    'Red Giant': '🔴',
    'Red Supergiant': '🔴',
    'Blue Giant': '🔵',
    'Blue Supergiant': '🔵',
    'Yellow Dwarf': '🟡',
    'White Dwarf': '⚪',
    'Neutron Star': '⚫',
    'Wolf-Rayet': '💫',
    'Cepheid Variable': '✨',
    'RR Lyrae Variable': '✨',
    'O-type Star': '💙',
    'Luminous Blue Variable': '🌟',
    'Yellow Hypergiant': '🟨',
    'Binary System': '👥',
    'Carbon Star': '🟤',
    'Be Star': '💎',
    'Magnetar': '🧲',
    'Herbig Ae/Be Star': '🌱',
    'Horizontal Branch Star': '🟠',
    'T Tauri Star': '🌸',
    'Mira Variable': '🔄',
    'Subdwarf B Star': '🔷',
    'Red Dwarf': '🔸',
    'Blue Straggler': '💫',
    'S-type Star': '🟣',
    'Helium Star': '🎈',
    'Extreme Helium Star': '🎆',
    'Lambda Bootis Star': '⭐',
    'RV Tauri Variable': '🌺',
    'Ap Star': '🔮',
    'Symbiotic Star': '🤝',
    'Delta Scuti Variable': '⚡'
  };
  return emojis[type] || '⭐';
};

const StarModal = ({ star, isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleKeyDownEffect = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDownEffect);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDownEffect);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!star) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <ModalHeader>
              <CloseButton onClick={onClose}>×</CloseButton>
              <StarIcon type={star.type}>
                {getStarEmoji(star.type)}
              </StarIcon>
              <StarName>{star.name}</StarName>
              <StarType>{star.type}</StarType>
            </ModalHeader>

            <ModalBody>
              <Description>{star.description}</Description>

              <PropertiesGrid>
                <PropertySection>
                  <SectionTitle>Physical Properties</SectionTitle>
                  <PropertyRow>
                    <PropertyLabel>Spectral Class</PropertyLabel>
                    <PropertyValue>{star.spectralClass}</PropertyValue>
                  </PropertyRow>
                  <PropertyRow>
                    <PropertyLabel>Temperature</PropertyLabel>
                    <PropertyValue>{star.temperature}</PropertyValue>
                  </PropertyRow>
                  <PropertyRow>
                    <PropertyLabel>Mass</PropertyLabel>
                    <PropertyValue>{star.mass}</PropertyValue>
                  </PropertyRow>
                  <PropertyRow>
                    <PropertyLabel>Luminosity</PropertyLabel>
                    <PropertyValue>{star.luminosity}</PropertyValue>
                  </PropertyRow>
                </PropertySection>

                <PropertySection>
                  <SectionTitle>Observational Data</SectionTitle>
                  <PropertyRow>
                    <PropertyLabel>Magnitude</PropertyLabel>
                    <PropertyValue>{star.magnitude}</PropertyValue>
                  </PropertyRow>
                  <PropertyRow>
                    <PropertyLabel>Distance</PropertyLabel>
                    <PropertyValue>{star.distance}</PropertyValue>
                  </PropertyRow>
                  <PropertyRow>
                    <PropertyLabel>Constellation</PropertyLabel>
                    <PropertyValue>{star.constellation}</PropertyValue>
                  </PropertyRow>
                  {star.variablePeriod && (
                    <PropertyRow>
                      <PropertyLabel>Variable Period</PropertyLabel>
                      <PropertyValue>{star.variablePeriod}</PropertyValue>
                    </PropertyRow>
                  )}
                  {star.rotationPeriod && (
                    <PropertyRow>
                      <PropertyLabel>Rotation Period</PropertyLabel>
                      <PropertyValue>{star.rotationPeriod}</PropertyValue>
                    </PropertyRow>
                  )}
                  {star.windSpeed && (
                    <PropertyRow>
                      <PropertyLabel>Wind Speed</PropertyLabel>
                      <PropertyValue>{star.windSpeed}</PropertyValue>
                    </PropertyRow>
                  )}
                  {star.magneticField && (
                    <PropertyRow>
                      <PropertyLabel>Magnetic Field</PropertyLabel>
                      <PropertyValue>{star.magneticField}</PropertyValue>
                    </PropertyRow>
                  )}
                  {star.orbitalPeriod && (
                    <PropertyRow>
                      <PropertyLabel>Orbital Period</PropertyLabel>
                      <PropertyValue>{star.orbitalPeriod}</PropertyValue>
                    </PropertyRow>
                  )}
                  {star.rotationSpeed && (
                    <PropertyRow>
                      <PropertyLabel>Rotation Speed</PropertyLabel>
                      <PropertyValue>{star.rotationSpeed}</PropertyValue>
                    </PropertyRow>
                  )}
                  {star.age && (
                    <PropertyRow>
                      <PropertyLabel>Age</PropertyLabel>
                      <PropertyValue>{star.age}</PropertyValue>
                    </PropertyRow>
                  )}
                </PropertySection>
              </PropertiesGrid>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default StarModal;
