import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const Card = styled(motion.div)`
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  display: ${props => props.viewMode === 'list' ? 'flex' : 'block'};
  gap: ${props => props.viewMode === 'list' ? '1.5rem' : '0'};
  font-family: var(--nasa-font);

  &:hover {
    transform: translateY(-5px);
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
    box-shadow: var(--shadow-strong);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: ${props => props.viewMode === 'list' ? '400px' : '100%'};
  height: ${props => props.viewMode === 'list' ? '225px' : '200px'};
  flex-shrink: 0;
  overflow: hidden;
  background: var(--primary-bg);
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
  user-select: none;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-text);
  font-size: 1.5rem;
  transition: var(--transition);
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
  }

  &::before {
    content: '▶';
    margin-left: 3px;
  }
`;

const Duration = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: var(--primary-text);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const Content = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--primary-text);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--nasa-font);
  font-weight: 700;
`;

const Description = styled.p`
  color: var(--secondary-text);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.viewMode === 'list' ? 4 : 3};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Metadata = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const MetadataItem = styled.span`
  font-size: 0.85rem;
  color: var(--tertiary-text);
  background: var(--tertiary-bg);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--secondary-bg);
  color: var(--primary-text);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;

  &:hover {
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
    transform: translateY(-1px);
  }
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
  max-width: 90vw;
  max-height: 90vh;
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

const VideoPlayer = styled.video`
  width: 100%;
  max-height: 60vh;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  user-select: none;
`;

const ModalTitle = styled.h2`
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  color: var(--secondary-text);
  font-family: var(--nasa-font);
  line-height: 1.6;
  max-height: 150px;
  overflow-y: auto;
`;

const VideoCard = ({ item, index, viewMode = 'grid' }) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const data = item.data[0];
  const links = item.links;
  
  const thumbnailUrl = links?.find(link => link.rel === 'preview')?.href;
  const videoUrl = links?.find(link => link.rel === 'captions')?.href;

  const formatDate = (dateString) => {
    if (!dateString) return t('unknown');
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return t('unknown');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayVideo = () => {
    if (videoUrl) {
      setShowModal(true);
    }
  };

  return (
    <>
      <Card
        viewMode={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <VideoContainer viewMode={viewMode}>
          {thumbnailUrl && !imageError ? (
            <>
              <VideoThumbnail
                src={thumbnailUrl}
                alt={data.title}
                onError={() => setImageError(true)}
                onClick={handlePlayVideo}
              />
              <PlayButton onClick={handlePlayVideo} />
              {data.duration && (
                <Duration>{formatDuration(data.duration)}</Duration>
              )}
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--secondary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-text)',
                fontSize: '2rem',
                border: '1px solid var(--border-color)'
              }}
            >
              🎬
            </div>
          )}
        </VideoContainer>

        <Content>
          <Title>{data.title}</Title>
          {data.description && (
            <Description viewMode={viewMode}>
              {data.description}
            </Description>
          )}

          <Metadata>
            {data.date_created && (
              <MetadataItem>{formatDate(data.date_created)}</MetadataItem>
            )}
            {data.center && (
              <MetadataItem>{data.center}</MetadataItem>
            )}
            <MetadataItem>{t('video')}</MetadataItem>
          </Metadata>

          <Actions>
            <ActionButton onClick={handlePlayVideo}>
              {t('playVideo')}
            </ActionButton>
          </Actions>
        </Content>
      </Card>

      {showModal && videoUrl && createPortal(
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
              <VideoPlayer
                src={videoUrl}
                controls
                autoPlay
                poster={thumbnailUrl}
              />
              <ModalTitle>{data.title}</ModalTitle>
              {data.description && (
                <ModalDescription>{data.description}</ModalDescription>
              )}
            </ModalContent>
          </Modal>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default VideoCard;
