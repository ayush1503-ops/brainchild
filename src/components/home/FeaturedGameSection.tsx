import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, Monitor, Gamepad2, Layers } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const FeaturedGameSection: React.FC = () => {
  const { games, setSelectedGame } = useStudio();
  const [isHovered, setIsHovered] = useState(false);

  // Get primary game
  const featuredGame = games.find((g) => g.featured) || games[0];

  return (
    <section
      id="featured-game-section"
      className="relative w-full py-24 bg-[#08090d] border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#ff5722] uppercase mb-2">
              <Sparkles size={13} />
              <span>02 / FLAGSHIP REVELATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              FEATURED UNIVERSE
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#22d3ee]">
              STATUS: {featuredGame.status}
            </span>
            <span>TARGET: {featuredGame.releaseYear}</span>
          </div>
        </div>

        {/* Full-Width Cinematic Game Portal */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-[#0f1118] shadow-2xl group transition-all duration-700 hover:border-[#ff5722]/60"
        >
          {/* Main Visual Artwork with Depth Movement */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src={featuredGame.heroImage}
              alt={featuredGame.title}
              className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                isHovered ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f]/90 via-transparent to-transparent pointer-events-none hidden md:block" />

            {/* Top Interactive Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-ping" />
                <span>UNREAL ENGINE 5 // NEXT-GEN PHYSICS</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-editorial text-zinc-300">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  {featuredGame.genre}
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="text-xs font-mono tracking-widest text-[#ff5722] uppercase">
                  {featuredGame.subtitle}
                </div>
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight">
                  {featuredGame.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 font-sans line-clamp-2 sm:line-clamp-none max-w-xl">
                  {featuredGame.description}
                </p>

                {/* Platform Icons */}
                <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Monitor size={14} className="text-[#22d3ee]" /> PC
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Gamepad2 size={14} className="text-[#ff5722]" /> PS5
                  </span>
                  <span>•</span>
                  <span>Xbox Series X|S</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  id="view-featured-game-btn"
                  onClick={() => setSelectedGame(featuredGame)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#ff5722] text-white font-editorial font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#ff5722]/30 hover:bg-[#f44710] transition-all duration-200 cursor-pointer"
                >
                  <span>VIEW GAME ARCHIVE</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => setSelectedGame(featuredGame)}
                  className="p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  title="Watch Gameplay Preview"
                >
                  <Play size={16} className="fill-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
