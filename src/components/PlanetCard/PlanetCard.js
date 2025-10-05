import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const PlanetCard = ({ planet, index }) => {
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
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
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
  );
};

export default PlanetCard;
