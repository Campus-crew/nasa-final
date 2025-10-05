import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1.1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--secondary-bg);
  color: var(--primary-text);
  transition: var(--transition);

  &::placeholder {
    color: var(--accent-text);
  }

  &:focus {
    outline: none;
    border-color: var(--secondary-text);
    background: var(--tertiary-bg);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent-text);
  font-size: 1rem;
  pointer-events: none;
  font-weight: bold;
  opacity: ${props => props.show ? 1 : 0};
  transition: var(--transition);
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--accent-text);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};

  &:hover {
    color: var(--primary-text);
    background: var(--hover-bg);
  }
`;

const SearchBar = ({ value, onChange, placeholder, onSubmit }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localValue, onChange, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(localValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchIcon show={localValue.length === 0}>SEARCH</SearchIcon>
        <SearchInput
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={localValue.length === 0 ? "" : placeholder}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <ClearButton
          type="button"
          show={localValue.length > 0}
          onClick={handleClear}
          aria-label="Clear search"
        >
          X
        </ClearButton>
      </form>
    </SearchContainer>
  );
};

export default SearchBar;
