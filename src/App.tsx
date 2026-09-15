import React, { useEffect } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { GameDiscoverySection } from './components/home/GameDiscoverySection';
import { FeaturedGameSection } from './components/home/FeaturedGameSection';
import { AboutBand } from './components/home/AboutBand';
import { NewsSection } from './components/home/NewsSection';
import { CareersTeaserSection } from './components/home/CareersTeaserSection';
import { ContactBand } from './components/home/ContactBand';
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
import { Toast } from './components/ui/Toast';

const AppContent: React.FC = () => {
  const { currentRoute, selectedGame, setSelectedGame, selectedArticle, setSelectedArticle, selectedJob, setSelectedJob } =
    useStudio();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper font-body text-ink antialiased selection:bg-coral selection:text-white">
      <Navbar />

      <main id="main-content" className="w-full">
        {currentRoute === 'home' && (
          <>
            <HeroSection />
            <GameDiscoverySection />
            <FeaturedGameSection />
            <AboutBand />
            <NewsSection />
            <CareersTeaserSection />
            <ContactBand />
            <NewsletterDropSection />
          </>
        )}

        {currentRoute === 'games' && <GamesPage />}
        {currentRoute === 'news' && <NewsPage mode="news" />}
        {currentRoute === 'blog' && <NewsPage mode="blog" />}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'careers' && <CareersPage />}
        {currentRoute === 'contact' && <ContactPage />}
      </main>

      <SignatureFooter />

      {/* Global overlays */}
      <StudioCMSModal />
      {selectedGame && <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
      {selectedArticle && <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      <Toast />
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
