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

  // Mock content data - in real app, fetch by ID
  const contentData = {
    id,
    title: 'Hubble Space Telescope Captures Stunning Galaxy Collision',
    description: `The Hubble Space Telescope has captured an extraordinary image of two galaxies in the process of merging, located approximately 230 million light-years away in the constellation Hercules. This cosmic dance, known as NGC 6052, showcases the violent yet beautiful process of galactic evolution.

When galaxies collide, they don't actually crash into each other like cars in an accident. Instead, their gravitational forces interact over millions of years, slowly pulling and distorting each other's shapes. The stars within each galaxy rarely collide due to the vast distances between them, but the gravitational interactions can trigger intense bursts of star formation.

This particular merger is in its early stages, with the two galactic cores still visible as distinct bright regions. Over the next billion years, these galaxies will continue their cosmic ballet, eventually forming a single, larger elliptical galaxy. The process will redistribute stars, gas, and dust, creating new stellar nurseries and potentially feeding the supermassive black holes at each galaxy's center.

The image was captured using Hubble's Wide Field Camera 3, which can observe in both visible and near-infrared light. This allows astronomers to peer through cosmic dust and see the underlying structure of these merging systems. The blue regions indicate areas of active star formation, where hot, young stars are being born from compressed gas and dust.`,
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    date: '2024-01-15',
    center: 'Goddard Space Flight Center',
    photographer: 'NASA/ESA Hubble Space Telescope',
    keywords: ['galaxy', 'merger', 'hubble', 'space telescope', 'astronomy'],
    location: 'Constellation Hercules',
    distance: '230 million light-years',
    catalogId: 'NGC 6052'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = () => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = contentData.imageUrl;
    link.download = `nasa-${contentData.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: contentData.title,
        text: contentData.description.substring(0, 200) + '...',
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
          {contentData.title}
        </ContentTitle>
        
        <ContentMeta>
          <MetaItem>{formatDate(contentData.date)}</MetaItem>
          <MetaItem>{contentData.center}</MetaItem>
          <MetaItem>{contentData.photographer}</MetaItem>
        </ContentMeta>
      </ContentHeader>

      <ContentBody>
        <MainContent>
          <ContentImage
            src={contentData.imageUrl}
            alt={contentData.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          
          <ContentDescription>
            {contentData.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </ContentDescription>
        </MainContent>

        <Sidebar>
          <SidebarTitle>Details</SidebarTitle>
          <InfoGrid>
            <InfoItem>
              <div className="label">Location</div>
              <div className="value">{contentData.location}</div>
            </InfoItem>
            <InfoItem>
              <div className="label">Distance</div>
              <div className="value">{contentData.distance}</div>
            </InfoItem>
            <InfoItem>
              <div className="label">Catalog ID</div>
              <div className="value">{contentData.catalogId}</div>
            </InfoItem>
            <InfoItem>
              <div className="label">Keywords</div>
              <div className="value">{contentData.keywords.join(', ')}</div>
            </InfoItem>
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
