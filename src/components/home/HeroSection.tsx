import React from 'react';
import { ArrowDown, Play, ArrowRight, Sparkles } from 'lucide-react';
import { HeroScene3D } from '../3d/HeroScene3D';
import { StudioMascot } from '../mascot/StudioMascot';
import { useStudio } from '../../context/StudioContext';

export const HeroSection: React.FC = () => {
  const { setCurrentRoute, games, setSelectedGame } = useStudio();
  const featuredGame = games.find((g) => g.featured) || games[0];

  const scrollToNext = () => {
    const el = document.getElementById('studio-introduction');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-12 bg-[#090a0d]"
    >
      {/* 3D WebGL Layer: Ambient Celestial Atmosphere */}
      <HeroScene3D className="z-0" />

      {/* Atmospheric lighting depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#ff5722]/10 blur-[180px] pointer-events-none z-0" />

      {/* Studio Header Subtitle */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono tracking-widest text-zinc-400 uppercase pt-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
          <span className="text-zinc-300">INDEPENDENT GAME STUDIO // MONTREAL</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <span>ESTABLISHED 2019</span>
          <span className="text-zinc-600">•</span>
          <span>UNREAL ENGINE 5 NATIVE</span>
        </div>
      </div>

      {/* Main Center Content: Editorial Typography + Cinematic Artwork */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold, Articulated Headline */}
          <div className="lg:col-span-8 flex flex-col items-start space-y-7">
            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-display font-black leading-[0.92] tracking-tight text-white uppercase select-none">
              WE MAKE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                WORLDS
              </span>{' '}
              <br />
              WORTH GETTING <br />
              <span className="text-[#ff5722]">LOST IN.</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-zinc-300 leading-relaxed font-sans font-normal">
              Brainchild Games is an independent game studio crafting kinetic, atmosphere-first
              universes. We obsess over weight, spatial curiosity, and tactile mechanics that respect
              the player’s intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-cta-explore"
                onClick={() => setCurrentRoute('games')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-white font-editorial font-bold text-xs tracking-wider uppercase shadow-xl shadow-[#ff5722]/30 transition-all duration-300 cursor-pointer"
              >
                <span>OUR WORLDS</span>
                <ArrowRight size={14} />
              </button>

              <button
                id="hero-cta-featured"
                onClick={() => setSelectedGame(featuredGame)}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30 font-editorial font-semibold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer"
              >
                <Play size={13} className="fill-white" />
                <span>WATCH AETHERBOUND TEASER</span>
              </button>
            </div>
          </div>

          {/* Right Column: Studio Emblem & Character Art */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <StudioMascot mode="hero" />
          </div>
        </div>
      </div>

      {/* Bottom Information Row */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between border-t border-white/10 pt-6 text-xs font-mono text-zinc-400">
        <button
          onClick={scrollToNext}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <span className="font-editorial tracking-wider uppercase text-[11px]">DISCOVER THE STUDIO</span>
          <ArrowDown size={13} />
        </button>

        <div className="flex items-center gap-6 text-[11px]">
          <span className="text-zinc-400">CURRENT FOCUS: AETHERBOUND (2026)</span>
          <span className="hidden md:inline text-zinc-600">•</span>
          <span className="hidden md:inline text-zinc-400">PC / PS5 / XBOX SERIES X|S</span>
        </div>
      </div>
    </section>
  );
};
