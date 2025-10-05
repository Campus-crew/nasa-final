import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(6, 9, 18, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  transition: var(--transition);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
  font-family: var(--nasa-font);

  &:hover {
    color: var(--secondary-text);
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: var(--secondary-bg);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
    color: var(--primary-text);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(6, 9, 18, 0.98);
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    border-top: 1px solid var(--border-color);
    backdrop-filter: blur(20px);
  }
`;

const NavLink = styled(Link)`
  color: var(--secondary-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-weight: 500;
  position: relative;
  font-family: var(--nasa-font);

  &:hover {
    color: var(--primary-text);
    background: var(--hover-bg);
  }

  &.active {
    color: var(--primary-text);
    background: var(--secondary-bg);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary-text);
    transition: var(--transition);
    transform: translateX(-50%);
  }

  &.active::after {
    width: 80%;
  }
`;

const LanguageButton = styled.button`
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  color: var(--primary-text);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-family: var(--nasa-font);
  font-weight: 500;
  margin-left: 1rem;

  &:hover {
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--primary-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-family: var(--nasa-font);

  &:hover {
    background: var(--hover-bg);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/library', label: t('library') },
    { path: '/videos', label: t('videos') },
    { path: '/map-andromeda', label: t('andromedaMap') },
  ];

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: scrolled 
          ? 'rgba(6, 9, 18, 0.98)' 
          : 'rgba(6, 9, 18, 0.95)',
      }}
    >
      <NavContent>
        <Logo to="/">
          <div className="logo-icon">W</div>
          WERNHER
        </Logo>

        <NavLinks isOpen={isOpen}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
          <LanguageButton onClick={toggleLanguage}>
            {language.toUpperCase()}
          </LanguageButton>
        </NavLinks>

        <NavActions>
          <MobileMenuButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </NavActions>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;
