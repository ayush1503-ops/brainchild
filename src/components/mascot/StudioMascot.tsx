import React, { useState } from 'react';

interface StudioMascotProps {
  mode?: 'hero' | 'floating' | 'footer' | 'badge' | 'compact';
  className?: string;
  showSpeech?: boolean;
  speechText?: string;
}

export const StudioMascot: React.FC<StudioMascotProps> = ({
  mode = 'floating',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (mode === 'badge') {
    return (
      <div
        id="mascot-badge"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
        title="Nova — Brainchild Studio Emblem"
      >
        <div className="w-8 h-8 rounded-lg bg-[#141622] border border-white/15 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#ff5722]">
          <img
            src="/src/assets/images/mascot_astro_1789202807233.jpg"
            alt="Brainchild Studio Emblem"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-xs uppercase tracking-widest text-zinc-400 group-hover:text-white font-editorial transition-colors">
          NOVA // 01
        </span>
      </div>
    );
  }

  return (
    <div
      id={`studio-mascot-${mode}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none transition-all duration-700 ease-out group ${className}`}
    >
      {/* Ambient atmospheric glow */}
      <div
        className={`absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-700 pointer-events-none ${
          isHovered
            ? 'bg-[#ff5722]/25 opacity-100'
            : 'bg-[#ff5722]/10 opacity-40'
        }`}
      />

      {/* Cinematic Sculpture Frame */}
      <div
        className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0e1017] transition-all duration-700 ${
          mode === 'hero'
            ? 'w-56 h-64 sm:w-64 sm:h-80 lg:w-72 lg:h-96'
            : mode === 'footer'
            ? 'w-44 h-52 sm:w-52 sm:h-60'
            : 'w-40 h-48 sm:w-48 sm:h-56'
        } ${isHovered ? 'border-[#ff5722]/60 shadow-[#ff5722]/20' : ''}`}
      >
        <img
          src="/src/assets/images/mascot_astro_1789202807233.jpg"
          alt="Nova the Explorer — Brainchild Games"
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Subtle cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-80" />

        {/* Understated Editorial Caption */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
          <span className="text-zinc-200 font-semibold">STUDIO EMBLEM // NOVA</span>
          <span className="text-[#ff5722]">01</span>
        </div>
      </div>
    </div>
  );
};
