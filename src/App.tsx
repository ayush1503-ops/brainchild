import React, { useEffect } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { IntroductionSection } from './components/home/IntroductionSection';
import { FeaturedGameSection } from './components/home/FeaturedGameSection';
import { AllGamesSection } from './components/home/AllGamesSection';
import { StudioSnapshotSection } from './components/home/StudioSnapshotSection';
import { LatestNewsSection } from './components/home/LatestNewsSection';
import { CareersTeaserSection } from './components/home/CareersTeaserSection';
import { NewsletterDropSection } from './components/home/NewsletterDropSection';
import { SignatureFooter } from './components/footer/SignatureFooter';
import { GamesPage } from './components/games/GamesPage';
import { NewsPage } from './components/news/NewsPage';
import { AboutPage } from './components/about/AboutPage';
import { CareersPage } from './components/careers/CareersPage';
import { ContactPage } from './components/contact/ContactPage';
import { StudioCMSModal } from './components/cms/StudioCMSModal';
import { GameDetailModal } from './components/games/GameDetailModal';
import { ArticleDetailModal } from './components/news/ArticleDetailModal';
import { JobDetailModal } from './components/careers/JobDetailModal';

const AppContent: React.FC = () => {
  const {
    currentRoute,
    selectedGame,
    setSelectedGame,
    selectedArticle,
    setSelectedArticle,
    selectedJob,
    setSelectedJob
  } = useStudio();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  return (
    <div className="min-h-screen bg-[#090a0d] text-zinc-100 selection:bg-[#ff5722] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Routed Content */}
      <main id="main-content" className="w-full">
        {currentRoute === 'home' && (
          <>
            <HeroSection />
            <IntroductionSection />
            <FeaturedGameSection />
            <AllGamesSection />
            <StudioSnapshotSection />
            <LatestNewsSection />
            <CareersTeaserSection />
            <NewsletterDropSection />
          </>
        )}

        {currentRoute === 'games' && <GamesPage />}
        {currentRoute === 'news' && <NewsPage />}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'careers' && <CareersPage />}
        {currentRoute === 'contact' && <ContactPage />}
      </main>

      {/* Signature World-Ending Footer */}
      <SignatureFooter />

      {/* Global Modals */}
      <StudioCMSModal />
      {selectedGame && (
        <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
      {selectedArticle && (
        <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
}
