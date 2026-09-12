import React from 'react';
import { ArrowUpRight, Sparkles, Monitor, Gamepad } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Game } from '../../types';

export const AllGamesSection: React.FC = () => {
  const { games, setSelectedGame, setCurrentRoute } = useStudio();

  // Find games
  const solaris = games.find((g) => g.slug.includes('solaris')) || games[1] || games[0];
  const chrono = games.find((g) => g.slug.includes('chrono')) || games[2] || games[0];
  const voidHeist = games.find((g) => g.slug.includes('void')) || games[3] || games[0];

  return (
    <section
      id="all-games-section"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#0a0b10] border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#ff5722] uppercase">
              <Sparkles size={13} />
              <span>03 / STUDIO CATALOGUE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight">
              EXPERIMENTAL WORLDS
            </h2>
          </div>

          <button
            onClick={() => setCurrentRoute('games')}
            className="inline-flex items-center gap-2 text-xs font-editorial font-bold tracking-widest text-zinc-300 hover:text-[#ff5722] uppercase transition-colors cursor-pointer group"
          >
            <span>VIEW COMPLETE CATALOGUE ({games.length})</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Asymmetrical Experimental Layout (Not identical cards!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* GAME 02: Tall Vertical Artwork Layout (Solaris Diver) - 5 Cols */}
          {solaris && (
            <div
              onClick={() => setSelectedGame(solaris)}
              className="lg:col-span-5 rounded-3xl overflow-hidden bg-[#11131c] border border-white/10 hover:border-[#fbbf24]/60 transition-all duration-500 flex flex-col justify-between group cursor-pointer shadow-xl relative"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={solaris.heroImage}
                  alt={solaris.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/30 to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#fbbf24] border border-[#fbbf24]/30">
                    {solaris.status}
                  </span>
                </div>
              </div>

              {/* Information Panel */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-[#fbbf24]">{solaris.genre}</span>
                  <span>{solaris.releaseYear}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-black text-white group-hover:text-[#fbbf24] transition-colors">
                  {solaris.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {solaris.description}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                    <Monitor size={13} className="text-[#fbbf24]" />
                    <span>{solaris.platforms.join(' • ')}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-editorial font-bold text-white group-hover:text-[#fbbf24] transition-colors">
                    VIEW GAME →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Right Column (7 Cols): Split layout with Chrono Monolith & Void Protocol */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            {/* GAME 03: Split Horizontal Image & Text (Chrono Monolith) */}
            {chrono && (
              <div
                onClick={() => setSelectedGame(chrono)}
                className="rounded-3xl overflow-hidden bg-[#11131c] border border-white/10 hover:border-[#22d3ee]/60 transition-all duration-500 group cursor-pointer shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-0 items-center"
              >
                <div className="sm:col-span-6 relative aspect-[4/3] sm:aspect-auto sm:h-full overflow-hidden">
                  <img
                    src={chrono.heroImage}
                    alt={chrono.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#11131c]/60 hidden sm:block" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#22d3ee] border border-[#22d3ee]/30">
                      {chrono.status}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-6 p-6 sm:p-8 space-y-3">
                  <div className="text-xs font-mono text-[#22d3ee]">{chrono.genre}</div>
                  <h3 className="text-2xl font-display font-black text-white group-hover:text-[#22d3ee] transition-colors">
                    {chrono.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {chrono.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-500 text-[11px]">TARGET: {chrono.releaseYear}</span>
                    <span className="font-editorial font-bold text-white group-hover:text-[#22d3ee] transition-colors">
                      VIEW GAME →
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* GAME 04: Panoramic Tactical Infiltration Section (Void Protocol) */}
            {voidHeist && (
              <div
                onClick={() => setSelectedGame(voidHeist)}
                className="relative rounded-3xl overflow-hidden bg-[#11131c] border border-white/10 hover:border-[#ff5722]/60 transition-all duration-500 group cursor-pointer shadow-xl p-6 sm:p-8 flex flex-col justify-between aspect-[16/8]"
              >
                <img
                  src={voidHeist.heroImage}
                  alt={voidHeist.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/70 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/80 text-[#ff5722] border border-[#ff5722]/30">
                    {voidHeist.status}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">{voidHeist.releaseYear}</span>
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {voidHeist.subtitle}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white group-hover:text-[#ff5722] transition-colors">
                    {voidHeist.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-xl line-clamp-2">
                    {voidHeist.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-editorial">
                    <span className="text-zinc-400 font-mono text-[11px]">{voidHeist.genre}</span>
                    <span className="font-bold text-white group-hover:text-[#ff5722] transition-colors">
                      VIEW GAME →
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
