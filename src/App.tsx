import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioProvider, useStudio } from './context/StudioContext';
import { AuthProvider } from './admin/context/AuthContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';

// Public site components
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
import { GamesPage as PublicGamesPage } from './components/games/GamesPage';
import { NewsPage as PublicNewsPage } from './components/news/NewsPage';
import { AboutPage as PublicAboutPage } from './components/about/AboutPage';
import { CareersPage as PublicCareersPage } from './components/careers/CareersPage';
import { ContactPage as PublicContactPage } from './components/contact/ContactPage';
import { GameDetailModal } from './components/games/GameDetailModal';
import { ArticleDetailModal } from './components/news/ArticleDetailModal';
import { JobDetailModal } from './components/careers/JobDetailModal';
import { Toast } from './components/ui/Toast';

// Admin pages
import { LoginPage } from './admin/pages/LoginPage';
import { ForgotPasswordPage } from './admin/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './admin/pages/ResetPasswordPage';
import { DashboardPage } from './admin/pages/DashboardPage';
import { GamesPage as AdminGamesPage } from './admin/pages/GamesPage';
import { NewsAdminPage } from './admin/pages/NewsAdminPage';
import { UsersPage } from './admin/pages/UsersPage';
import { SubscribersPage } from './admin/pages/SubscribersPage';
import { CategoriesPage } from './admin/pages/CategoriesPage';
import { SettingsPage } from './admin/pages/SettingsPage';

const PublicApp: React.FC = () => {
  const { currentRoute, selectedGame, setSelectedGame, selectedArticle, setSelectedArticle, selectedJob, setSelectedJob } =
    useStudio();

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

        {currentRoute === 'games' && <PublicGamesPage />}
        {currentRoute === 'news' && <PublicNewsPage mode="news" />}
        {currentRoute === 'blog' && <PublicNewsPage mode="blog" />}
        {currentRoute === 'about' && <PublicAboutPage />}
        {currentRoute === 'careers' && <PublicCareersPage />}
        {currentRoute === 'contact' && <PublicContactPage />}
      </main>

      <SignatureFooter />

      {/* Global overlays */}
      {selectedGame && <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
      {selectedArticle && <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Authentication Routes */}
        <Route
          path="/admin/login"
          element={
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          }
        />
        <Route
          path="/admin/forgot-password"
          element={
            <AuthProvider>
              <ForgotPasswordPage />
            </AuthProvider>
          }
        />
        <Route
          path="/admin/reset-password"
          element={
            <AuthProvider>
              <ResetPasswordPage />
            </AuthProvider>
          }
        />

        {/* Protected Admin Console Routes */}
        <Route
          path="/admin"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </AuthProvider>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="games" element={<AdminGamesPage />} />
          <Route path="news" element={<NewsAdminPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Public Studio Website (Preserves original design 100%) */}
        <Route
          path="/*"
          element={
            <StudioProvider>
              <PublicApp />
            </StudioProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
