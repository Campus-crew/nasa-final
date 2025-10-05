import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { nasaApiService } from '../../services/nasaApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SearchBar from '../../components/SearchBar/SearchBar';
import VideoCard from '../../components/VideoCard/VideoCard';
import { useLanguage } from '../../contexts/LanguageContext';

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

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' 
      ? 'repeat(auto-fill, minmax(350px, 1fr))' 
      : '1fr'
  };
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => 
      props.view === 'grid' 
        ? 'repeat(auto-fill, minmax(300px, 1fr))' 
        : '1fr'
    };
    gap: 1.5rem;
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

const VideoLibrary = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch NASA videos
  const { data: videosData, isLoading, error } = useQuery(
    ['nasa-videos', searchQuery, currentPage],
    () => nasaApiService.searchVideos(searchQuery || 'space', currentPage),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
    }
  );

  const categories = [
    { key: 'all', label: t('allVideos'), query: '' },
    { key: 'planets', label: t('planets'), query: 'planet solar system' },
    { key: 'galaxies', label: t('galaxies'), query: 'galaxy milky way andromeda' },
    { key: 'stars', label: t('stars'), query: 'star sun solar' },
    { key: 'nebulae', label: t('nebulae'), query: 'nebula cosmic dust' },
    { key: 'mars', label: t('mars'), query: 'mars martian surface' },
    { key: 'hubble', label: t('hubble'), query: 'hubble telescope deep space' },
    { key: 'jwst', label: t('jwst'), query: 'james webb telescope infrared' },
  ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category.key);
    setSearchQuery(category.query);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const videos = videosData?.collection?.items?.filter(item => 
    item.data[0]?.media_type === 'video'
  ) || [];
  const totalHits = videosData?.collection?.metadata?.total_hits || 0;

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="icon">❌</span>
          <h3>{t('errorLoadingVideos')}</h3>
          <p>{t('unableToFetchVideos')}</p>
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
          {t('nasaVideoLibrary')}
        </PageTitle>
        <PageSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('videoLibrarySubtitle')}
        </PageSubtitle>
      </PageHeader>

      <SearchSection>
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder={t('searchVideosPlaceholder')}
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
              {totalHits > 0 ? `${totalHits.toLocaleString()} ${t('videosFound')}` : t('noVideosFound')}
              {searchQuery && searchQuery.trim() && ` ${t('for')} "${searchQuery}"`}
            </ResultsCount>
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                {t('grid')}
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                {t('list')}
              </ViewButton>
            </ViewToggle>
          </ResultsHeader>

          {videos.length > 0 ? (
            <>
              <VideosGrid view={viewMode}>
                <AnimatePresence>
                  {videos.map((item, index) => (
                    <VideoCard
                      key={`${item.data[0]?.nasa_id}-${index}`}
                      item={item}
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </VideosGrid>

              {videos.length < totalHits && (
                <LoadMoreButton
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? t('loading') : t('loadMoreVideos')}
                </LoadMoreButton>
              )}
            </>
          ) : (
            <EmptyState
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="icon">🎬</span>
              <h3>{t('noVideosFound')}</h3>
              <p>{t('tryAdjustingVideo')}</p>
            </EmptyState>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default VideoLibrary;
