import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { nasaApiService } from '../../services/nasaApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const DetailContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  color: var(--primary-text);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 3rem;
`;

const ContentTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-weight: 700;
  line-height: 1.2;
`;

const ContentMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const MetaItem = styled.span`
  font-size: 0.9rem;
  color: var(--tertiary-text);
  background: var(--tertiary-bg);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
`;

const ContentBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const ContentImage = styled(motion.img)`
  width: 100%;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  box-shadow: var(--shadow-strong);
`;

const ContentDescription = styled.div`
  color: var(--secondary-text);
  line-height: 1.7;
  font-size: 1.1rem;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const Sidebar = styled.div`
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  height: fit-content;
`;

const SidebarTitle = styled.h3`
  color: var(--primary-text);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const InfoItem = styled.div`
  .label {
    font-size: 0.85rem;
    color: var(--tertiary-text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }
  
  .value {
    color: var(--primary-text);
    font-weight: 500;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary ? 'var(--primary-text)' : 'var(--secondary-bg)'};
  color: ${props => props.primary ? 'var(--primary-bg)' : 'var(--primary-text)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;

  &:hover {
    background: ${props => props.primary ? 'var(--secondary-text)' : 'var(--tertiary-bg)'};
    transform: translateY(-2px);
  }
`;

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch actual content data by NASA ID
  const { data: contentData, isLoading, error } = useQuery(
    ['nasa-content', id],
    () => nasaApiService.getAssetById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  if (isLoading) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate(-1)}>
          ← Back to Library
        </BackButton>
        <LoadingSpinner />
      </DetailContainer>
    );
  }

  if (error || !contentData) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate(-1)}>
          ← Back to Library
        </BackButton>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--secondary-text)' }}>
          <h3 style={{ color: 'var(--primary-text)', marginBottom: '1rem' }}>Content Not Found</h3>
          <p>The requested NASA content could not be found or loaded.</p>
        </div>
      </DetailContainer>
    );
  }

  const data = contentData.collection?.items?.[0]?.data?.[0] || {};
  const links = contentData.collection?.items?.[0]?.links || [];
  const imageUrl = links.find(link => link.rel === 'preview')?.href;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `nasa-${data.nasa_id || id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title || 'NASA Content',
        text: (data.description || '').substring(0, 200) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate(-1)}>
        ← Back to Library
      </BackButton>

      <ContentHeader>
        <ContentTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {data.title || 'NASA Content'}
        </ContentTitle>
        
        <ContentMeta>
          {data.date_created && <MetaItem>{formatDate(data.date_created)}</MetaItem>}
          {data.center && <MetaItem>{data.center}</MetaItem>}
          {data.photographer && <MetaItem>{data.photographer}</MetaItem>}
          {data.media_type && <MetaItem>{data.media_type}</MetaItem>}
        </ContentMeta>
      </ContentHeader>

      <ContentBody>
        <MainContent>
          {imageUrl && (
            <ContentImage
              src={imageUrl}
              alt={data.title || 'NASA Content'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          )}
          
          <ContentDescription>
            {data.description ? (
              data.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>No description available for this NASA content.</p>
            )}
          </ContentDescription>
        </MainContent>

        <Sidebar>
          <SidebarTitle>Details</SidebarTitle>
          <InfoGrid>
            {data.nasa_id && (
              <InfoItem>
                <div className="label">NASA ID</div>
                <div className="value">{data.nasa_id}</div>
              </InfoItem>
            )}
            {data.location && (
              <InfoItem>
                <div className="label">Location</div>
                <div className="value">{data.location}</div>
              </InfoItem>
            )}
            {data.secondary_creator && (
              <InfoItem>
                <div className="label">Creator</div>
                <div className="value">{data.secondary_creator}</div>
              </InfoItem>
            )}
            {data.keywords && data.keywords.length > 0 && (
              <InfoItem>
                <div className="label">Keywords</div>
                <div className="value">{data.keywords.join(', ')}</div>
              </InfoItem>
            )}
          </InfoGrid>

          <ActionButtons>
            <ActionButton primary onClick={handleDownload}>
              Download
            </ActionButton>
            <ActionButton onClick={handleShare}>
              Share
            </ActionButton>
          </ActionButtons>
        </Sidebar>
      </ContentBody>
    </DetailContainer>
  );
};

export default ContentDetail;
