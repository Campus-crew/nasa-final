import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: var(--secondary-bg);
  border-top: 1px solid var(--border-color);
  padding: 3rem 2rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: var(--primary-text);
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-family: var(--nasa-font);
    font-weight: 700;
  }

  p {
    color: var(--secondary-text);
    line-height: 1.6;
    margin-bottom: 1rem;
    font-family: var(--nasa-font);
  }

  a {
    color: var(--secondary-text);
    text-decoration: none;
    transition: var(--transition);
    font-family: var(--nasa-font);

    &:hover {
      color: var(--primary-text);
    }
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--secondary-text);
  font-size: 0.9rem;
  font-family: var(--nasa-font);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--tertiary-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-text);
  text-decoration: none;
  transition: var(--transition);
  font-size: 1rem;

  &:hover {
    background: var(--light-bg);
    border-color: var(--accent-text);
    color: var(--primary-text);
    transform: translateY(-2px);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>NASA Explorer</h3>
          <p>
            Discover the wonders of space through NASA's comprehensive database of exoplanets, 
            stunning imagery, and cutting-edge astronomical research.
          </p>
        </FooterSection>
        
        <FooterSection>
          <h3>Explore</h3>
          <FooterLinks>
            <a href="/planets">Exoplanets</a>
            <a href="/library">Object Library</a>
            <a href="/">Home</a>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>NASA Resources</h3>
          <FooterLinks>
            <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer">
              NASA Official Site
            </a>
            <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer">
              NASA Open Data
            </a>
            <a href="https://exoplanetarchive.ipac.caltech.edu" target="_blank" rel="noopener noreferrer">
              Exoplanet Archive
            </a>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>About</h3>
          <FooterLinks>
            <a href="#team">Our Team</a>
            <a href="https://www.linkedin.com/company/kernelgroupkz" target="_blank" rel="noopener noreferrer">
              Kernel Group
            </a>
            <a href="https://github.com/Campus-crew/nasa" target="_blank" rel="noopener noreferrer">
              Source Code
            </a>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>
          Built with NASA Open APIs. Not affiliated with NASA.
        </Copyright>
        
        <SocialLinks>
          <SocialLink
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            GH
          </SocialLink>
          <SocialLink
            href="https://twitter.com/nasa"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            TW
          </SocialLink>
          <SocialLink
            href="https://nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            NASA
          </SocialLink>
        </SocialLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
