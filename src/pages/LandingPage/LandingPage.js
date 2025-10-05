import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { nasaApiService } from '../../services/nasaApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AnimatedText from '../../components/AnimatedText/AnimatedText';
import { useLanguage } from '../../contexts/LanguageContext';

const LandingContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: 
    radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  
  /* Добавляем анимированные звезды как fallback */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, #eee, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: sparkle 20s linear infinite;
    opacity: 0.3;
    z-index: -1;
  }
  
  @keyframes sparkle {
    from { transform: translateX(0); }
    to { transform: translateX(200px); }
  }
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  z-index: 1;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 2;
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  padding: 2rem;
  z-index: 10;
  position: relative;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: var(--primary-text);
  font-family: var(--nasa-font);
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--secondary-text);
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: var(--primary-text);
    color: var(--primary-bg);
    box-shadow: var(--shadow-soft);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-strong);
      background: var(--secondary-text);
    }
  }

  &.secondary {
    background: transparent;
    color: var(--primary-text);
    border: 2px solid var(--border-color);

    &:hover {
      background: var(--hover-bg);
      border-color: var(--secondary-text);
      transform: translateY(-2px);
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--primary-text);
  font-family: var(--nasa-font);
  font-weight: 700;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    background: var(--tertiary-bg);
    border-color: var(--accent-text);
    box-shadow: var(--shadow-soft);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-text);
    font-weight: 600;
  }

  p {
    color: var(--secondary-text);
    line-height: 1.6;
  }
`;

const APODSection = styled.section`
  padding: 4rem 2rem;
  background: var(--secondary-bg);
`;

const APODContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const APODImage = styled(motion.img)`
  width: 100%;
  max-width: 600px;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  box-shadow: var(--shadow-strong);
`;

const APODTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-text);
`;

const APODDescription = styled.p`
  color: var(--secondary-text);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const TeamSection = styled.section`
  padding: 6rem 2rem;
  background: var(--primary-bg);
`;

const TeamContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const TeamGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: nowrap;
  max-width: 1400px;
  margin: 0 auto;
  overflow-x: auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const TeamMember = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  min-width: 140px;
`;

const MemberPhoto = styled.a`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--secondary-bg);
  border: 3px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--accent-text);
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;

  &:hover {
    border-color: var(--secondary-text);
    background: var(--tertiary-bg);
    transform: scale(1.05);
  }
`;

const MemberName = styled.h4`
  color: var(--primary-text);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const MemberRole = styled.p`
  color: var(--tertiary-text);
  font-size: 0.9rem;
  margin: 0;
`;

const LandingPage = () => {
  const { t } = useLanguage();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  
  const { data: apodData, isLoading: apodLoading } = useQuery(
    'apod',
    () => nasaApiService.getAPOD(),
    {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
    }
  );

  const features = [
    {
      title: t('exploreExoplanets'),
      description: t('exploreExoplanetsDesc'),
    },
    {
      title: t('nasaContentLibrary'),
      description: t('nasaContentLibraryDesc'),
    },
    {
      title: t('realTimeData'),
      description: t('realTimeDataDesc'),
    },
  ];

  const teamMembers = [
    { name: 'Dulatuly Nurasyl', role: 'Project Lead', initials: 'DN', linkedin: 'https://linkedin.com/in/dulatuly-nurasyl' },
    { name: 'Yergaliyeva Dariya', role: 'Frontend Developer', initials: 'YD', linkedin: 'https://linkedin.com/in/yergaliyeva-dariya' },
    { name: 'Yerlepes Bek', role: 'Backend Developer', initials: 'YB', linkedin: 'https://linkedin.com/in/yerlepes-bek' },
    { name: 'Bazhikey Assel', role: 'UI/UX Designer', initials: 'BA', linkedin: 'https://linkedin.com/in/bazhikey-assel' },
    { name: 'Serdar Dundar', role: 'Frontend Developer', initials: 'SD', linkedin: 'https://linkedin.com/in/serdar-dundar' },
  ];

  return (
    <LandingContainer>
      <HeroSection>
        {/* Пробуем загрузить видео с fallback */}
        <BackgroundVideo
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          onError={(e) => {
            console.log('Video error:', e.target.currentSrc);
            setVideoError(true);
          }}
          onCanPlay={(e) => {
            console.log('Video loaded:', e.target.currentSrc);
            setVideoLoaded(true);
          }}
          style={{ 
            display: videoError ? 'none' : 'block',
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          {/* Using NASA SpaceX Crew Transportation video only */}
          <source src="https://images-assets.nasa.gov/video/NASA%20Certifies%20SpaceX%20Crew%20Transportation%20System%20for%20Regular%20Astronaut%20Flights%20to%20Space/NASA%20Certifies%20SpaceX%20Crew%20Transportation%20System%20for%20Regular%20Astronaut%20Flights%20to%20Space~orig.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </BackgroundVideo>
        <VideoOverlay />
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedText
              texts={[
                'Explore the Universe',
                'Inspire the Universe',
                'Discover the Universe',
                'Navigate the Universe',
                'Experience the Universe',
              ]}
            />
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('heroSubtitle')}
          </HeroSubtitle>
          <CTAButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <CTAButton to="/library" className="primary">
              {t('browseLibrary')}
            </CTAButton>
            <CTAButton to="/map-andromeda" className="secondary">
              {t('exploreAndromeda')}
            </CTAButton>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t('featuresTitle')}
        </SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <APODSection>
        <APODContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('apodTitle')}
          </SectionTitle>
          {apodLoading ? (
            <LoadingSpinner />
          ) : apodData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {apodData.media_type === 'image' && (
                <APODImage
                  src={apodData.url}
                  alt={apodData.title}
                  loading="lazy"
                />
              )}
              <APODTitle>{apodData.title}</APODTitle>
              <APODDescription>{apodData.explanation}</APODDescription>
            </motion.div>
          )}
        </APODContainer>
      </APODSection>

      <TeamSection>
        <TeamContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Team
          </SectionTitle>
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MemberPhoto
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {member.initials}
                </MemberPhoto>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </TeamContainer>
      </TeamSection>
    </LandingContainer>
  );
};

export default LandingPage;
