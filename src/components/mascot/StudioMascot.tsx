import React, { useState } from 'react';
import { Sparkles, MessageSquare, Compass, Rocket } from 'lucide-react';
import { playUiClick } from '../../utils/sound';

interface StudioMascotProps {
  mode?: 'hero' | 'floating' | 'footer' | 'badge' | 'compact';
  className?: string;
  showSpeech?: boolean;
  speechText?: string;
}

export const StudioMascot: React.FC<StudioMascotProps> = ({
  mode = 'floating',
  className = '',
  showSpeech = false,
  speechText = 'Welcome, Explorer! Ready to jump into space?',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const quotes = [
    "Welcome, Explorer! Ready to jump into space?",
    "Check out Aetherbound — our gravity adventure game!",
    "Brainchild Games crafts zero-gravity kinetic worlds.",
    "Click anywhere to discover hidden cosmic anomalies!",
    "Zero-gravity equations verified and ready for launch 🚀"
  ];

  const handleMascotClick = () => {
    playUiClick();
    setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const currentSpeech = speechText || quotes[activeQuoteIndex];

  if (mode === 'badge') {
    return (
      <div
        id="mascot-badge"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMascotClick}
        className={`relative inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
        title="Nova — Brainchild Studio Emblem"
      >
        <div className="w-9 h-9 rounded-xl bg-[#141622] border border-white/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#ff5722] group-hover:shadow-[0_0_15px_rgba(255,87,34,0.4)]">
          <img
            src="/src/assets/images/mascot_astro_1789202807233.jpg"
            alt="Brainchild Mascot Nova"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-zinc-300 group-hover:text-white font-editorial transition-colors flex items-center gap-1">
            NOVA <Sparkles size={10} className="text-[#ff5722]" />
          </span>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            STUDIO EMBLEM
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`studio-mascot-${mode}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMascotClick}
      className={`relative select-none cursor-pointer transition-all duration-700 ease-out group ${className}`}
    >
      {/* Interactive Speech Bubble */}
      {(showSpeech || isHovered) && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 min-w-[220px] max-w-[280px] bg-[#121524] text-white px-4 py-2.5 rounded-2xl border border-[#ff5722]/50 shadow-2xl backdrop-blur-md animate-bounce-slow text-xs font-sans font-medium text-center pointer-events-none">
          <div className="flex items-center justify-center gap-1.5 mb-0.5 text-[10px] font-mono text-[#ff5722] uppercase tracking-wider">
            <MessageSquare size={11} />
            <span>NOVA SPEAKS</span>
          </div>
          <p className="text-zinc-200 leading-snug">{currentSpeech}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#121524]" />
        </div>
      )}

      {/* Ambient atmospheric glow */}
      <div
        className={`absolute -inset-6 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isHovered
            ? 'bg-[#ff5722]/35 opacity-100'
            : 'bg-[#ff5722]/15 opacity-50'
        }`}
      />

      {/* Hero / Floating Display */}
      <div
        className={`relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-b from-[#141727] via-[#0b0d16] to-[#06070b] transition-all duration-500 ${
          mode === 'hero'
            ? 'w-64 h-72 sm:w-72 sm:h-88 lg:w-80 lg:h-96'
            : mode === 'footer'
            ? 'w-48 h-56 sm:w-56 sm:h-64'
            : 'w-44 h-52 sm:w-52 sm:h-60'
        } ${isHovered ? 'border-[#ff5722] shadow-[0_0_30px_rgba(255,87,34,0.3)] scale-[1.02]' : ''}`}
      >
        {/* Floating Stars Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Mascot Image */}
        <img
          src="/src/assets/images/mascot_astro_1789202807233.jpg"
          alt="Nova the Astronaut — Brainchild Games Mascot"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-110 rotate-1' : 'scale-100 animate-float-slow'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-90" />

        {/* Floating Interactive Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#090a0f]/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#ff5722] flex items-center gap-1.5 uppercase tracking-wider">
          <Rocket size={11} className="animate-pulse" />
          <span>PILOT NOVA</span>
        </div>

        {/* Editorial Caption with Official Sub-name */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-300 uppercase bg-[#090a0f]/80 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Compass size={12} className="text-[#ff5722]" />
            <span className="font-bold text-white">BRAINCHILD ASTRO</span>
          </div>
          <span className="text-[#ff5722] font-bold">01</span>
        </div>
      </div>
    </div>
  );
};

