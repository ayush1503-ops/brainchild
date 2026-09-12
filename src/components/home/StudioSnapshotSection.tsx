import React from 'react';
import { MapPin, Users, Flame, Globe2, ArrowRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const StudioSnapshotSection: React.FC = () => {
  const { setCurrentRoute } = useStudio();

  return (
    <section
      id="studio-snapshot"
      className="relative py-24 px-4 sm:px-6 lg:px-12 bg-[#090a0e] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Who We Are & Snapshot Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#22d3ee] uppercase">
              <Globe2 size={13} />
              <span>04 / STUDIO IDENTITY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              BORN IN MONTREAL. <br />
              <span className="text-[#ff5722]">DRIFTING</span> EVERYWHERE.
            </h2>

            <p className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
              Brainchild Games is an independent game workshop of 28 creators across North America,
              Europe, and Japan. We don’t pursue trends or bloated live-service roadmaps. We craft
              tightly scoped, mechanically inventive experiences that honor your time and stay with you long after the credits roll.
            </p>

            {/* Micro Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">WHERE WE WORK</div>
                <div className="text-xs font-editorial font-bold text-white flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#ff5722]" /> Montreal & Remote
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">CORE TEAM</div>
                <div className="text-xs font-editorial font-bold text-white flex items-center gap-1.5">
                  <Users size={12} className="text-[#22d3ee]" /> 28 Artisans
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">WHAT WE BUILD</div>
                <div className="text-xs font-editorial font-bold text-white flex items-center gap-1.5">
                  <Flame size={12} className="text-[#fbbf24]" /> Kinetic Sci-Fi
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setCurrentRoute('about')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30 font-editorial font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>ABOUT THE STUDIO</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Right: Studio Aesthetic Collage / Visual Snapshot */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#12141d] p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-mono text-[#ff5722] font-semibold">
                    TRANSMISSION RECORD // 09-12
                  </span>
                  <span className="text-xs font-mono text-zinc-500">SYS.VER 4.2</span>
                </div>

                <blockquote className="text-lg sm:text-xl font-editorial font-medium text-zinc-200 italic leading-snug">
                  "If a game world doesn’t make the team want to step into the monitor and wander around
                  at 3 AM, we scrap it and start over."
                </blockquote>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs font-bold text-white">Julian Vance & Maya Lin</div>
                    <div className="text-[11px] font-mono text-zinc-400">Co-Founders, Brainchild Games</div>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-[#ff5722]/50 p-0.5 overflow-hidden">
                    <img
                      src="/src/assets/images/mascot_astro_1789202807233.jpg"
                      alt="Brainchild"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle decorative offset card */}
            <div className="absolute -bottom-4 -right-4 w-32 h-20 bg-gradient-to-tr from-[#ff5722]/20 to-transparent rounded-2xl -z-10 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
