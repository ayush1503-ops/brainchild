import React, { useState } from 'react';
import { ArrowUp, Disc, Terminal, Shield, Code2, Sparkles, Send } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StudioMascot } from '../mascot/StudioMascot';
import { PageRoute } from '../../types';

export const SignatureFooter: React.FC = () => {
  const { setCurrentRoute, subscribeNewsletter, setIsCmsOpen } = useStudio();
  const [quickEmail, setQuickEmail] = useState('');
  const [subscribedToast, setSubscribedToast] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail) {
      subscribeNewsletter('Explorer', quickEmail, ['All Drops']);
      setSubscribedToast(true);
      setQuickEmail('');
      setTimeout(() => setSubscribedToast(false), 4000);
    }
  };

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'GAMES', route: 'games' },
    { label: 'NEWS', route: 'news' },
    { label: 'ABOUT', route: 'about' },
    { label: 'CAREERS', route: 'careers' },
    { label: 'CONTACT', route: 'contact' },
  ];

  return (
    <footer
      id="signature-footer"
      className="relative w-full bg-[#06070a] border-t border-white/10 text-white overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-12"
    >
      {/* Background Starfield & Celestial horizon */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#181b29] via-[#08090d] to-[#040508] opacity-80 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#ff5722]/15 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Final Cinematic Credits Scene */}
        <div className="flex flex-col items-center text-center space-y-8 pb-20 border-b border-white/10">
          {/* Interactive Mascot Final Scene */}
          <div className="relative">
            <StudioMascot mode="footer" showSpeech={true} speechText="End of Transmission. Jump again?" />
          </div>

          {/* Large Final Farewell Typography */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#ff5722] uppercase">
              <Sparkles size={12} />
              <span>TRANSMISSION TERMINATED // CREDITS ROLL</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight uppercase leading-[0.95] text-white">
              SEE YOU IN THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff8a65] to-[#22d3ee]">
                NEXT WORLD.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
              Crafted with analog love and digital obsession in Montreal, QC. All gravity equations verified by Nova.
            </p>
          </div>

          {/* Quick Footer Newsletter */}
          <form onSubmit={handleQuickSubscribe} className="w-full max-w-md flex items-center gap-2 bg-[#12141e] p-1.5 rounded-full border border-white/15 shadow-xl">
            <input
              type="email"
              required
              value={quickEmail}
              onChange={(e) => setQuickEmail(e.target.value)}
              placeholder="Enter frequency (email) to stay linked..."
              className="flex-1 px-4 py-2.5 bg-transparent text-xs text-white placeholder-zinc-500 font-sans focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-white font-editorial font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>LINK</span>
              <Send size={12} />
            </button>
          </form>
          {subscribedToast && (
            <span className="text-xs text-emerald-400 font-editorial">
              ✓ Coordinates registered! Welcome to the Brainchild network.
            </span>
          )}
        </div>

        {/* Navigation & Studio Links */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/10">
          {/* Brand Info (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#141622] border border-[#ff5722]/60 overflow-hidden flex items-center justify-center">
                <img
                  src="/src/assets/images/mascot_astro_1789202807233.jpg"
                  alt="Brainchild Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display font-extrabold text-sm tracking-wider text-white block leading-none">
                  BRAINCHILD GAMES
                </span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  EST. 2019 • INDIE STUDIO
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm">
              We make games for players who relish depth, spatial curiosity, and tactile mechanics.
              Always independent, always world-first.
            </p>

            <button
              onClick={() => setIsCmsOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#22d3ee] hover:underline cursor-pointer"
            >
              <Terminal size={12} />
              <span>Studio Content Management & Export</span>
            </button>
          </div>

          {/* Studio Navigation (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono text-[#ff5722] uppercase tracking-widest font-bold">
              NAVIGATION
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  onClick={() => setCurrentRoute(item.route)}
                  className="text-left text-xs font-editorial text-zinc-400 hover:text-white transition-colors cursor-pointer py-1"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channels & Communities (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono text-[#22d3ee] uppercase tracking-widest font-bold">
              FREQUENCIES
            </div>
            <div className="flex flex-col gap-2 text-xs font-editorial text-zinc-400">
              <a
                href="#discord"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#ff5722] transition-colors flex items-center gap-2"
              >
                <span>Discord Community (18,000+ Pilots)</span>
              </a>
              <a
                href="#steam"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#ff5722] transition-colors flex items-center gap-2"
              >
                <span>Steam Developer Hub</span>
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#ff5722] transition-colors flex items-center gap-2"
              >
                <span>YouTube Devlog Cinema</span>
              </a>
              <a
                href="#x"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#ff5722] transition-colors flex items-center gap-2"
              >
                <span>X / Twitter @BrainchildGames</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Telemetry bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2019–2026 BRAINCHILD GAMES INC. ALL RIGHTS RESERVED.</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">PRIVACY POLICY</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">TERMS OF SERVICE</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">COOKIE PROTOCOLS</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-editorial text-zinc-400 hover:text-[#ff5722] transition-colors cursor-pointer group"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
