import React, { useState } from 'react';
import { Sparkles, Monitor, Gamepad2, ArrowRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { GameDetailModal } from './GameDetailModal';

export const GamesPage: React.FC = () => {
  const { games, selectedGame, setSelectedGame } = useStudio();
  const [filter, setFilter] = useState<'ALL' | 'PC' | 'CONSOLE' | 'UPCOMING'>('ALL');

  const filteredGames = games.filter((g) => {
    if (filter === 'ALL') return true;
    if (filter === 'PC') return g.platforms.some((p) => p.includes('PC') || p.includes('Steam') || p.includes('Mac'));
    if (filter === 'CONSOLE') return g.platforms.some((p) => p.includes('PlayStation') || p.includes('Xbox') || p.includes('Switch'));
    if (filter === 'UPCOMING') return g.status === 'Wishlist Now' || g.status === 'In Development';
    return true;
  });

  const filterTabs: ('ALL' | 'PC' | 'CONSOLE' | 'UPCOMING')[] = ['ALL', 'PC', 'CONSOLE', 'UPCOMING'];

  return (
    <div id="games-page" className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-12 bg-[#08090d]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Hero Header */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ff5722]">
            <Sparkles size={12} />
            <span>PLAYABLE REALITIES // STUDIO ARCHIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
            OUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff8a65] to-[#22d3ee]">
              WORLDS.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-2xl">
            Each title created at Brainchild is built on custom kinematic foundations. We explore strange
            phenomena—fractured gravity, blistering stars, non-linear architecture, and tactical infiltration.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 bg-[#12141d] p-1 rounded-full border border-white/10">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-full text-xs font-editorial font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  filter === tab
                    ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-zinc-500">
            DISPLAYING {filteredGames.length} OF {games.length} WORLDS
          </div>
        </div>

        {/* Immersive Games Grid */}
        <div className="space-y-16">
          {filteredGames.map((game, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="relative rounded-3xl overflow-hidden bg-[#11131c] border border-white/10 hover:border-[#ff5722]/60 transition-all duration-500 group cursor-pointer shadow-2xl"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual Artwork Column (7 Cols) */}
                  <div className={`lg:col-span-7 relative aspect-[16/9] w-full overflow-hidden ${isReversed ? 'lg:order-2' : ''}`}>
                    <img
                      src={game.heroImage}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-transparent lg:hidden" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-black/75 backdrop-blur-md text-[#ff5722] border border-[#ff5722]/30 font-bold">
                        {game.status}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Description Column (5 Cols) */}
                  <div className={`lg:col-span-5 p-8 sm:p-12 space-y-6 ${isReversed ? 'lg:order-1' : ''}`}>
                    <div className="space-y-2">
                      <div className="text-xs font-mono tracking-widest text-[#22d3ee] uppercase">
                        {game.subtitle}
                      </div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tight group-hover:text-[#ff5722] transition-colors">
                        {game.title}
                      </h3>
                      <div className="text-xs font-mono text-zinc-400">
                        {game.genre} • TARGET: {game.releaseYear}
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                      {game.description}
                    </p>

                    {/* Platforms */}
                    <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400 pt-2">
                      {game.platforms.map((p) => (
                        <span key={p} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                          {p}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-editorial font-bold text-white group-hover:text-[#ff5722] transition-colors inline-flex items-center gap-2">
                        <span>OPEN FULL DOSSIER</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>

                      <span className="text-[11px] font-mono text-zinc-500">
                        VER // 2026.4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGame && (
        <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
};
