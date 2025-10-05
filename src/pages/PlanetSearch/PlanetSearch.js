import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { nasaApiService } from '../../services/nasaApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SearchBar from '../../components/SearchBar/SearchBar';
import PlanetCard from '../../components/PlanetCard/PlanetCard';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-weight: 700;
`;

const PageSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: var(--secondary-text);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SearchSection = styled.div`
  margin-bottom: 3rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background: ${props => props.active ? 'var(--primary-text)' : 'var(--secondary-bg)'};
  color: ${props => props.active ? 'var(--primary-bg)' : 'var(--primary-text)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? 'var(--secondary-text)' : 'var(--tertiary-bg)'};
    transform: translateY(-2px);
  }
`;

const ResultsSection = styled.div`
  margin-bottom: 2rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ResultsCount = styled.p`
  color: var(--secondary-text);
  font-size: 1.1rem;
`;

const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--secondary-bg);
  color: var(--primary-text);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;

  option {
    background: var(--secondary-bg);
    color: var(--primary-text);
  }
`;

const PlanetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
`;

const LoadMoreButton = styled(motion.button)`
  display: block;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background: var(--primary-text);
  color: var(--primary-bg);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-strong);
    background: var(--secondary-text);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--secondary-text);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-text);
  }
`;

const PlanetSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('disc_year');
  const [displayedPlanets, setDisplayedPlanets] = useState([]);
  const [page, setPage] = useState(1);
  const planetsPerPage = 20;

  // Fetch exoplanets data
  const { data: planetsData, isLoading, error } = useQuery(
    ['exoplanets', searchQuery],
    () => nasaApiService.searchExoplanets(searchQuery, 1000),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      enabled: true,
    }
  );

  // Process and filter planets
  const processedPlanets = React.useMemo(() => {
    if (!planetsData) return [];

    let filtered = planetsData.filter(planet => {
      if (!planet.pl_name) return false;
      
      switch (activeFilter) {
        case 'recent':
          return planet.disc_year && planet.disc_year >= 2020;
        case 'habitable':
          return planet.pl_rade && planet.pl_rade >= 0.5 && planet.pl_rade <= 2.0;
        case 'large':
          return planet.pl_rade && planet.pl_rade > 2.0;
        default:
          return true;
      }
    });

    // Sort planets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'disc_year':
          return (b.disc_year || 0) - (a.disc_year || 0);
        case 'name':
          return (a.pl_name || '').localeCompare(b.pl_name || '');
        case 'size':
          return (b.pl_rade || 0) - (a.pl_rade || 0);
        case 'distance':
          return (a.st_dist || Infinity) - (b.st_dist || Infinity);
        default:
          return 0;
      }
    });

    return filtered;
  }, [planetsData, activeFilter, sortBy]);

  // Update displayed planets when data changes
  useEffect(() => {
    if (processedPlanets.length > 0) {
      setDisplayedPlanets(processedPlanets.slice(0, planetsPerPage));
      setPage(1);
    }
  }, [processedPlanets]);

  const loadMorePlanets = () => {
    const nextPage = page + 1;
    const startIndex = nextPage * planetsPerPage;
    const endIndex = startIndex + planetsPerPage;
    const newPlanets = processedPlanets.slice(startIndex, endIndex);
    
    if (newPlanets.length > 0) {
      setDisplayedPlanets(prev => [...prev, ...newPlanets]);
      setPage(nextPage);
    }
  };

  const filters = [
    { key: 'all', label: 'All Planets' },
    { key: 'recent', label: 'Recent Discoveries' },
    { key: 'habitable', label: 'Potentially Habitable' },
    { key: 'large', label: 'Large Planets' },
  ];

  const sortOptions = [
    { value: 'disc_year', label: 'Discovery Year' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
    { value: 'distance', label: 'Distance' },
  ];

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="icon">!</span>
          <h3>Error Loading Planets</h3>
          <p>Unable to fetch exoplanet data. Please try again later.</p>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Exoplanet Explorer
        </PageTitle>
        <PageSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover thousands of planets beyond our solar system. Search, filter, and explore the fascinating worlds that orbit distant stars.
        </PageSubtitle>
      </PageHeader>

      <SearchSection>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for exoplanets by name..."
        />
      </SearchSection>

      <FilterSection>
        {filters.map((filter) => (
          <FilterButton
            key={filter.key}
            active={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </FilterSection>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ResultsSection>
            <ResultsHeader>
              <ResultsCount>
                Found {processedPlanets.length} planets
                {searchQuery && ` matching "${searchQuery}"`}
              </ResultsCount>
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </SortSelect>
            </ResultsHeader>

            {displayedPlanets.length > 0 ? (
              <>
                <PlanetsGrid>
                  <AnimatePresence>
                    {displayedPlanets.map((planet, index) => (
                      <PlanetCard
                        key={`${planet.pl_name}-${index}`}
                        planet={planet}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </PlanetsGrid>

                {displayedPlanets.length < processedPlanets.length && (
                  <LoadMoreButton
                    onClick={loadMorePlanets}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Load More Planets
                  </LoadMoreButton>
                )}
              </>
            ) : (
              <EmptyState
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="icon">?</span>
                <h3>No Planets Found</h3>
                <p>Try adjusting your search terms or filters to find more results.</p>
              </EmptyState>
            )}
          </ResultsSection>
        </>
      )}
    </PageContainer>
  );
};

export default PlanetSearch;
