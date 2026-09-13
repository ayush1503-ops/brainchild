import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { PageRoute } from '../../types';

import { BrainchildLogo } from '../common/BrainchildLogo';

export const Navbar: React.FC = () => {
  const { currentRoute, setCurrentRoute, isCmsOpen, setIsCmsOpen, isAudioActive, toggleAudio } = useStudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'GAMES', route: 'games' },
    { label: 'DISPATCHES', route: 'news' },
    { label: 'STUDIO', route: 'about' },
    { label: 'CAREERS', route: 'careers' },
    { label: 'CONTACT', route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#090a0d]/90 backdrop-blur-md border-b border-white/10 py-2.5 shadow-2xl'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Studio Official Brand Logo with Astronaut Mascot */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group cursor-pointer focus:outline-none"
            aria-label="Brainchild Games Home"
          >
            <BrainchildLogo variant="navbar" animated={true} />
          </button>

          {/* Clean Editorial Navigation Links */}
          <nav id="desktop-navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => handleNavClick(item.route)}
                  className={`relative px-4 py-1.5 text-xs font-editorial font-medium tracking-widest uppercase transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#ff5722] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Secondary Actions: Subtle Audio, CMS & Explore */}
          <div className="flex items-center gap-3">
            {/* Minimal Ambient Audio Toggle */}
            <button
              id="audio-toggle-btn"
              onClick={toggleAudio}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isAudioActive
                  ? 'border-[#ff5722]/60 text-[#ff5722] bg-[#ff5722]/10'
                  : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/25 bg-white/5'
              }`}
              title={isAudioActive ? 'Mute ambient sound' : 'Enable ambient sound'}
              aria-label="Toggle ambient sound"
            >
              {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Studio CMS Dashboard Trigger */}
            <button
              id="open-cms-btn"
              onClick={() => setIsCmsOpen(!isCmsOpen)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono tracking-wider text-zinc-300 hover:text-white rounded-lg border border-white/10 hover:border-white/30 bg-white/5 transition-all cursor-pointer"
              title="Open Studio Content Manager"
            >
              <SlidersHorizontal size={12} className="text-[#ff5722]" />
              <span>CMS</span>
            </button>

            {/* Direct Catalogue CTA */}
            <button
              id="nav-cta-explore"
              onClick={() => handleNavClick('games')}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-editorial font-bold tracking-wider uppercase rounded-full bg-white text-black hover:bg-[#ff5722] hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
            >
              <span>OUR WORLDS</span>
              <ArrowUpRight size={13} />
            </button>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white bg-white/5 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-x-0 top-[68px] bg-[#090a0d]/98 backdrop-blur-2xl border-b border-white/10 p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => (
              <button
                key={item.route}
                id={`mobile-nav-${item.route}`}
                onClick={() => handleNavClick(item.route)}
                className={`text-left px-4 py-3 rounded-xl font-editorial text-xs tracking-wider uppercase font-semibold transition-colors ${
                  currentRoute === item.route
                    ? 'bg-[#ff5722] text-white'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              id="mobile-cms-btn"
              onClick={() => {
                setIsCmsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-mono text-[#22d3ee] px-3 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <SlidersHorizontal size={13} />
              <span>STUDIO CMS</span>
            </button>

            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 text-xs text-zinc-400 px-3 py-2 rounded-lg bg-white/5"
            >
              {isAudioActive ? <Volume2 size={14} className="text-[#ff5722]" /> : <VolumeX size={14} />}
              <span>{isAudioActive ? 'Sound On' : 'Sound Off'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
