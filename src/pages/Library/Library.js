import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { nasaApiService } from '../../services/nasaApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SearchBar from '../../components/SearchBar/SearchBar';
import ImageCard from '../../components/ImageCard/ImageCard';

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

const CategorySection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryButton = styled.button`
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

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-text)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-bg)' : 'var(--primary-text)'};
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: ${props => props.active ? 'var(--secondary-text)' : 'var(--hover-bg)'};
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' 
      ? 'repeat(auto-fill, minmax(280px, 1fr))' 
      : '1fr'
  };
  gap: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => 
      props.view === 'grid' 
        ? 'repeat(auto-fill, minmax(250px, 1fr))' 
        : '1fr'
    };
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

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('space');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch NASA images
  const { data: imagesData, isLoading, error } = useQuery(
    ['nasa-images', searchQuery, currentPage],
    () => nasaApiService.searchImages(searchQuery, currentPage),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
    }
  );

  const categories = [
    { key: 'all', label: 'All Objects', query: 'space' },
    { key: 'planets', label: 'Planets', query: 'planet' },
    { key: 'galaxies', label: 'Galaxies', query: 'galaxy' },
    { key: 'nebulae', label: 'Nebulae', query: 'nebula' },
    { key: 'mars', label: 'Mars', query: 'mars' },
    { key: 'earth', label: 'Earth', query: 'earth' },
    { key: 'hubble', label: 'Hubble', query: 'hubble' },
    { key: 'apollo', label: 'Apollo', query: 'apollo' },
  ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category.key);
    setSearchQuery(category.query);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const images = imagesData?.collection?.items || [];
  const totalHits = imagesData?.collection?.metadata?.total_hits || 0;

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="icon">!</span>
          <h3>Error Loading Objects</h3>
          <p>Unable to fetch NASA object library. Please try again later.</p>
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
          NASA Object Library
        </PageTitle>
        <PageSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore NASA's vast collection of space objects, from stunning planetary photos to deep space telescope captures and historic mission documentation.
        </PageSubtitle>
      </PageHeader>

      <SearchSection>
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Search NASA object library..."
        />
      </SearchSection>

      <CategorySection>
        {categories.map((category) => (
          <CategoryButton
            key={category.key}
            active={activeCategory === category.key}
            onClick={() => handleCategoryChange(category)}
          >
            {category.label}
          </CategoryButton>
        ))}
      </CategorySection>

      {isLoading && currentPage === 1 ? (
        <LoadingSpinner />
      ) : (
        <>
          <ResultsHeader>
            <ResultsCount>
              {totalHits > 0 ? `${totalHits.toLocaleString()} objects found` : 'No objects found'}
              {searchQuery && ` for "${searchQuery}"`}
            </ResultsCount>
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                List
              </ViewButton>
            </ViewToggle>
          </ResultsHeader>

          {images.length > 0 ? (
            <>
              <ImagesGrid view={viewMode}>
                <AnimatePresence>
                  {images.map((item, index) => (
                    <ImageCard
                      key={`${item.data[0]?.nasa_id}-${index}`}
                      item={item}
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </ImagesGrid>

              {images.length < totalHits && (
                <LoadMoreButton
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? 'Loading...' : 'Load More Objects'}
                </LoadMoreButton>
              )}
            </>
          ) : (
            <EmptyState
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="icon">?</span>
              <h3>No Objects Found</h3>
              <p>Try adjusting your search terms or browse different categories.</p>
            </EmptyState>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default Library;
