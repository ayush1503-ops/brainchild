import React, { useState } from 'react';
import { X, Play, Monitor, Gamepad2, Award, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Game } from '../../types';

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [wishlistDone, setWishlistDone] = useState(false);

  if (!game) return null;

  const currentScreenshot = game.screenshots[activeImageIndex] || game.heroImage;

  return (
    <div
      id="game-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-start justify-center p-2 sm:p-6 lg:p-10 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#0d0e15] border border-white/15 shadow-2xl overflow-hidden text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/70 hover:bg-[#ff5722] text-white border border-white/20 transition-colors cursor-pointer"
          aria-label="Close game archive"
        >
          <X size={20} />
        </button>

        {/* Hero Cinematic Artwork Header */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black">
          {isPlayingTrailer ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/95 p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#ff5722]/20 border border-[#ff5722] flex items-center justify-center text-[#ff5722] animate-pulse">
                <Play size={28} />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white">OFFICIAL ENGINE CINEMATIC TEASER</h4>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Running Real-Time on PlayStation 5 / PC</p>
              </div>
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="px-4 py-2 rounded-full bg-white/10 text-xs font-editorial text-zinc-300 hover:text-white"
              >
                Close Preview Player
              </button>
            </div>
          ) : (
            <>
              <img
                src={game.heroImage}
                alt={game.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-[#0d0e15]/40 to-transparent" />

              {/* Play Trailer Floating Trigger */}
              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#ff5722]/90 hover:bg-[#ff5722] text-white flex items-center justify-center shadow-2xl shadow-[#ff5722]/50 hover:scale-110 transition-all cursor-pointer group"
                title="Play Engine Teaser"
              >
                <Play size={28} className="fill-white translate-x-0.5" />
              </button>

              {/* Badges on hero */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-[#ff5722]">
                  {game.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-zinc-300">
                  {game.genre}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Main Content Container */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-12">
          {/* Header Title & Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest text-[#ff5722] uppercase">
                {game.subtitle}
              </div>
              <h2 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
                {game.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 pt-1">
                <span>TARGET: {game.releaseYear}</span>
                <span>•</span>
                <span>PLATFORMS: {game.platforms.join(' | ')}</span>
              </div>
            </div>

            {/* Store & Wishlist Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setWishlistDone(!wishlistDone)}
                className={`px-7 py-3.5 rounded-full font-editorial font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xl ${
                  wishlistDone
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                    : 'bg-[#ff5722] hover:bg-[#f04814] text-white shadow-[#ff5722]/30'
                }`}
              >
                {wishlistDone ? (
                  <>
                    <Check size={14} />
                    <span>WISHLISTED ON STEAM</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>WISHLIST NOW</span>
                  </>
                )}
              </button>

              {game.storeLinks.map((store) => (
                <a
                  key={store.name}
                  href={store.url}
                  onClick={(e) => e.preventDefault()}
                  className="px-5 py-3.5 rounded-full bg-white/5 border border-white/15 hover:border-white/40 hover:bg-white/10 text-white font-editorial font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{store.name}</span>
                  <ArrowUpRight size={13} className="text-[#22d3ee]" />
                </a>
              ))}
            </div>
          </div>

          {/* Description & Core Synopsis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">
                ABOUT THE GAME
              </h3>
              <p className="text-base text-zinc-300 font-sans leading-relaxed">
                {game.longDescription}
              </p>

              {/* Key Features */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-mono tracking-widest text-[#22d3ee] uppercase font-bold">
                  KEY SYSTEMS & FEATURES
                </h4>
                <div className="space-y-3">
                  {game.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300 font-sans">
                      <span className="w-5 h-5 rounded-full bg-[#ff5722]/20 border border-[#ff5722]/40 text-[#ff5722] text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technical Spec & Mechanics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#131520] border border-white/10 space-y-4">
                <h4 className="text-xs font-mono tracking-widest text-[#ff5722] uppercase font-bold">
                  GAMEPLAY MECHANICS BREAKDOWN
                </h4>
                <div className="space-y-4">
                  {game.gameplayMechanics.map((mech, i) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="text-xs font-editorial font-bold text-white mb-1">
                        {mech.title}
                      </div>
                      <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                        {mech.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Story snippet */}
              <div className="p-6 rounded-2xl bg-[#131520] border border-white/10 space-y-2">
                <h4 className="text-xs font-mono tracking-widest text-[#fbbf24] uppercase font-bold">
                  DEVELOPMENT ARCHIVE
                </h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed italic">
                  "{game.devStory}"
                </p>
              </div>
            </div>
          </div>

          {/* Screenshots Gallery Section */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">
                SCREENSHOT ARCHIVE
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                {activeImageIndex + 1} OF {game.screenshots.length} CAPTURES
              </span>
            </div>

            {/* Active Screenshot Display */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <img
                src={currentScreenshot}
                alt={`${game.title} capture`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnails row */}
            <div className="grid grid-cols-4 gap-3">
              {game.screenshots.map((shot, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[16/9] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#ff5722] scale-[1.02] shadow-lg shadow-[#ff5722]/20'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={shot}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
