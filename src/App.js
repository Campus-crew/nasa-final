import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navigation from './components/Navigation/Navigation';
import LandingPage from './pages/LandingPage/LandingPage';
import PlanetSearch from './pages/PlanetSearch/PlanetSearch';
import Library from './pages/Library/Library';
import ContentDetail from './pages/ContentDetail/ContentDetail';
import MapAndromeda from './pages/MapAndromeda/MapAndromeda';
import Footer from './components/Footer/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--primary-bg);
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding-top: 80px; /* Account for fixed navigation */
`;

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100vw',
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: '100vw',
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function App() {
  const location = useLocation();
  const isAndromedaPage = location.pathname === '/map-andromeda';

  return (
    <AppContainer>
      {!isAndromedaPage && <Navigation />}
      <MainContent>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LandingPage />
                </motion.div>
              } 
            />
            <Route 
              path="/planets" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PlanetSearch />
                </motion.div>
              } 
            />
            <Route 
              path="/library" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Library />
                </motion.div>
              } 
            />
            <Route 
              path="/content/:id" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ContentDetail />
                </motion.div>
              } 
            />
            <Route 
              path="/map-andromeda" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MapAndromeda />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </MainContent>
      {!isAndromedaPage && <Footer />}
    </AppContainer>
  );
}

export default App;
