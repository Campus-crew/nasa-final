import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Card = styled(motion.div)`
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: var(--transition);
  cursor: pointer;
  font-family: var(--nasa-font);

  &:hover {
    transform: translateY(-5px);
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
    box-shadow: var(--shadow-strong);
  }
`;

const PlanetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PlanetIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--light-bg);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  color: var(--primary-text);
`;

const PlanetInfo = styled.div`
  flex: 1;
`;

const PlanetName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-weight: 700;
`;

const HostStar = styled.p`
  color: var(--secondary-text);
  font-size: 0.9rem;
  font-weight: 500;
  font-family: var(--nasa-font);
`;

const PlanetDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  .label {
    font-size: 0.8rem;
    color: var(--tertiary-text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
    font-family: var(--nasa-font);
  }
  
  .value {
    color: var(--primary-text);
    font-weight: 500;
    font-family: var(--nasa-font);
  }
`;

const PlanetTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: var(--tertiary-bg);
  color: var(--secondary-text);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: var(--nasa-font);
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  max-width: 800px;
  max-height: 90vh;
  width: 100%;
  position: relative;
  background: var(--secondary-bg);
  border-radius: var(--border-radius);
  padding: 2rem;
  border: 1px solid var(--border-color);
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  color: var(--primary-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const ModalPlanetIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--light-bg);
  border: 3px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  color: var(--primary-text);
  font-weight: bold;
`;

const ModalTitle = styled.h2`
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const ModalSubtitle = styled.p`
  color: var(--secondary-text);
  font-family: var(--nasa-font);
  font-size: 1.1rem;
  margin: 0;
`;

const ModalDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ModalDetailItem = styled.div`
  background: var(--tertiary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;

  .label {
    font-size: 0.9rem;
    color: var(--tertiary-text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    font-family: var(--nasa-font);
    font-weight: 600;
  }
  
  .value {
    color: var(--primary-text);
    font-weight: 600;
    font-family: var(--nasa-font);
    font-size: 1.1rem;
  }
`;

const PlanetImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.8"/><circle cx="80" cy="30" r="0.5" fill="white" opacity="0.6"/><circle cx="40" cy="60" r="0.8" fill="white" opacity="0.7"/><circle cx="70" cy="80" r="0.6" fill="white" opacity="0.5"/><circle cx="30" cy="80" r="1.2" fill="white" opacity="0.9"/></svg>');
    background-size: 200px 200px;
  }

  .planet-visual {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #7986cb, #5c6bc0, #3f51b5);
    box-shadow: 0 0 30px rgba(121, 134, 203, 0.4);
    position: relative;
    z-index: 1;
  }
`;

const PlanetCard = ({ planet, index }) => {
  const [showModal, setShowModal] = useState(false);

  const formatValue = (value, unit = '', decimals = 2) => {
    if (value === null || value === undefined || value === '') {
      return 'Unknown';
    }
    
    const num = parseFloat(value);
    if (isNaN(num)) return 'Unknown';
    
    return `${num.toFixed(decimals)} ${unit}`.trim();
  };

  const getPlanetIcon = (radius) => {
    if (!radius) return 'P';
    const r = parseFloat(radius);
    if (r < 1) return 'S'; // Small planet
    if (r < 2) return 'E'; // Earth-like
    if (r < 4) return 'N'; // Neptune-like
    return 'J'; // Jupiter-like
  };

  const getPlanetTags = (planet) => {
    const tags = [];
    
    if (planet.disc_year && planet.disc_year >= 2020) {
      tags.push('Recent Discovery');
    }
    
    if (planet.pl_rade) {
      const radius = parseFloat(planet.pl_rade);
      if (radius >= 0.5 && radius <= 2.0) {
        tags.push('Potentially Habitable');
      }
      if (radius > 2.0) {
        tags.push('Large Planet');
      }
    }
    
    if (planet.pl_orbper && parseFloat(planet.pl_orbper) < 365) {
      tags.push('Short Year');
    }
    
    return tags;
  };

  const tags = getPlanetTags(planet);

  return (
    <>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        onClick={() => setShowModal(true)}
      >
      <PlanetHeader>
        <PlanetIcon>
          {getPlanetIcon(planet.pl_rade)}
        </PlanetIcon>
        <PlanetInfo>
          <PlanetName>{planet.pl_name || 'Unknown Planet'}</PlanetName>
          <HostStar>
            Host Star: {planet.hostname || 'Unknown'}
          </HostStar>
        </PlanetInfo>
      </PlanetHeader>

      <PlanetDetails>
        <DetailItem>
          <div className="label">Discovery Year</div>
          <div className="value">{planet.disc_year || 'Unknown'}</div>
        </DetailItem>
        <DetailItem>
          <div className="label">Orbital Period</div>
          <div className="value">{formatValue(planet.pl_orbper, 'days')}</div>
        </DetailItem>
        <DetailItem>
          <div className="label">Planet Radius</div>
          <div className="value">{formatValue(planet.pl_rade, 'Earth radii')}</div>
        </DetailItem>
        <DetailItem>
          <div className="label">Distance</div>
          <div className="value">{formatValue(planet.st_dist, 'parsecs')}</div>
        </DetailItem>
      </PlanetDetails>

        {tags.length > 0 && (
          <PlanetTags>
            {tags.map((tag, tagIndex) => (
              <Tag key={tagIndex}>{tag}</Tag>
            ))}
          </PlanetTags>
        )}
      </Card>

      {showModal && createPortal(
        <AnimatePresence>
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setShowModal(false)}>
                ×
              </CloseButton>
              
              <PlanetImage>
                <div className="planet-visual"></div>
              </PlanetImage>

              <ModalHeader>
                <ModalPlanetIcon>
                  {getPlanetIcon(planet.pl_rade)}
                </ModalPlanetIcon>
                <div>
                  <ModalTitle>{planet.pl_name || 'Unknown Planet'}</ModalTitle>
                  <ModalSubtitle>
                    Host Star: {planet.hostname || 'Unknown'}
                  </ModalSubtitle>
                </div>
              </ModalHeader>

              <ModalDetails>
                <ModalDetailItem>
                  <div className="label">Discovery Year</div>
                  <div className="value">{planet.disc_year || 'Unknown'}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Discovery Method</div>
                  <div className="value">{planet.discoverymethod || 'Unknown'}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Orbital Period</div>
                  <div className="value">{formatValue(planet.pl_orbper, 'days')}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Planet Radius</div>
                  <div className="value">{formatValue(planet.pl_rade, 'Earth radii')}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Planet Mass</div>
                  <div className="value">{formatValue(planet.pl_bmasse, 'Earth masses')}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Distance from Star</div>
                  <div className="value">{formatValue(planet.pl_orbsmax, 'AU')}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Distance from Earth</div>
                  <div className="value">{formatValue(planet.st_dist, 'parsecs')}</div>
                </ModalDetailItem>
                <ModalDetailItem>
                  <div className="label">Stellar Temperature</div>
                  <div className="value">{formatValue(planet.st_teff, 'K', 0)}</div>
                </ModalDetailItem>
              </ModalDetails>

              {tags.length > 0 && (
                <PlanetTags>
                  {tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </PlanetTags>
              )}
            </ModalContent>
          </Modal>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default PlanetCard;
