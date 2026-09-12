import React, { useState } from 'react';
import { Sparkles, Compass, Heart, Award, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import { STUDIO_TIMELINE, TEAM_MEMBERS } from '../../data/initialData';
import { StudioMascot } from '../mascot/StudioMascot';
import { useStudio } from '../../context/StudioContext';

export const AboutPage: React.FC = () => {
  const { setCurrentRoute, setIsCmsOpen } = useStudio();
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  const philosophies = [
    {
      title: 'Play Over Polish Until Polish Feels Like Play',
      desc: 'If a movement mechanic doesn’t spark a smile in a greybox test room within 15 seconds, no amount of 8K shaders will rescue it. We prototype relentlessly.'
    },
    {
      title: 'World-First Architecture',
      desc: 'We don’t treat environments as passive backdrops. In our games, rocks have historical strata, star systems obey gravitational anomalies, and architecture tells wordless stories.'
    },
    {
      title: 'Human Sustenance Over Crunch',
      desc: 'Great art comes from rested minds with lived experiences outside of video games. We operate on a strict 4-day work week and zero mandatory overtime.'
    }
  ];

  return (
    <div id="about-page" className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-12 bg-[#08090d]">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Page Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ff5722]">
              <Compass size={12} />
              <span>THE STUDIO ORIGIN // 2019–PRESENT</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white uppercase tracking-tight leading-[0.92]">
              IT STARTED <br />
              WITH A GAME.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff8a65] to-[#22d3ee]">
                THEN WE KEPT GOING.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl">
              Brainchild Games was founded around a kitchen table in Montreal by two developers who
              wanted to step away from corporate assembly-line production. Today, we are 28 artists,
              physicists, and designers united by a single obsession: creating places worth exploring.
            </p>
          </div>

          {/* Right Mascot in Studio Environment */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <StudioMascot mode="floating" showSpeech={true} speechText="Born in 2019! 🚀" />
            <div className="mt-4 text-center">
              <span className="text-xs font-mono text-zinc-400">NOVA // ARCHIVAL UNIT</span>
            </div>
          </div>
        </div>

        {/* Visual Studio Story Section */}
        <div className="rounded-3xl bg-[#11131c] border border-white/10 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-6">
            <div className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest font-bold">
              OUR JOURNEY & CREATIVE SOUL
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              WHY WE REJECT GENERIC FORMULAS
            </h2>
            <p className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
              The modern games landscape is flooded with algorithm-driven Skinner boxes and live-service
              engagement traps. We wanted something different: games that evoke the sensory wonder of
              picking up a strange cartridge in 1998, or walking into an exhibition where every corner
              holds an unexpected sculptural revelation.
            </p>
            <p className="text-zinc-400 font-sans leading-relaxed text-sm">
              We invest heavily in bespoke kinetic engineering. From our custom zero-g horizon-anchor
              physics to dynamic volumetric solar storms, every system is designed from scratch to serve
              the emotional core of that world.
            </p>
          </div>
        </div>

        {/* Interactive Studio Timeline */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono text-[#ff5722] uppercase tracking-widest font-bold mb-1">
                CHRONOLOGY
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
                STUDIO MILESTONES
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              SELECT A MILESTONE TO VIEW TELEMETRY
            </span>
          </div>

          {/* Timeline navigation pills */}
          <div className="flex flex-wrap gap-3">
            {STUDIO_TIMELINE.map((item, idx) => (
              <button
                key={item.year}
                onClick={() => setActiveTimelineIndex(idx)}
                className={`px-6 py-3 rounded-full text-xs font-editorial font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTimelineIndex === idx
                    ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/30 scale-105'
                    : 'bg-[#12141e] text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {item.year} // {item.tag}
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#121420] via-[#0e1017] to-[#151828] border border-white/15 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest font-bold">
                  {STUDIO_TIMELINE[activeTimelineIndex].tag} • {STUDIO_TIMELINE[activeTimelineIndex].year}
                </div>
                <h3 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                  {STUDIO_TIMELINE[activeTimelineIndex].title}
                </h3>
                <p className="text-base text-zinc-300 font-sans leading-relaxed">
                  {STUDIO_TIMELINE[activeTimelineIndex].description}
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-32 h-32 rounded-2xl bg-[#090b10] border border-[#ff5722]/40 flex items-center justify-center p-4 text-center">
                  <div className="space-y-1">
                    <Award size={32} className="text-[#ff5722] mx-auto" />
                    <div className="text-xs font-mono text-zinc-300 uppercase font-bold">
                      {STUDIO_TIMELINE[activeTimelineIndex].year}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Philosophies */}
        <div className="space-y-8">
          <div>
            <div className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest font-bold mb-1">
              OUR BELIEFS
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              CREATIVE PHILOSOPHY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophies.map((phil, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-[#11131c] border border-white/10 hover:border-[#ff5722]/50 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#ff5722] font-bold mb-3">0{i + 1} // PRINCIPLE</div>
                  <h3 className="text-xl font-display font-bold text-white mb-2 leading-snug">
                    {phil.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                    {phil.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                  <ShieldCheck size={12} className="text-[#22d3ee]" /> NON-NEGOTIABLE
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Leadership */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono text-[#fbbf24] uppercase tracking-widest font-bold mb-1">
                STUDIO LEADERSHIP
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
                THE WORLD ARCHITECTS
              </h2>
            </div>
            <button
              onClick={() => setCurrentRoute('careers')}
              className="text-xs font-editorial font-bold text-[#ff5722] hover:text-white uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
            >
              <span>JOIN OUR CREW</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="p-6 rounded-2xl bg-[#11131c] border border-white/10 hover:border-white/30 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-xl text-black"
                    style={{ backgroundColor: member.photoColor }}
                  >
                    {member.name[0]}
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-bold text-white">{member.name}</h3>
                    <div className="text-xs font-mono text-[#ff5722] mt-0.5">{member.role}</div>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                  <span className="text-zinc-400">FAVORITES:</span> {member.favoriteGame}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CMS Edit notice for studio client */}
        <div className="p-6 rounded-2xl bg-[#12141d] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-[#22d3ee]" />
            <span className="text-xs font-mono text-zinc-300">
              Studio Leadership & CMS: All About content and milestones are editable via the Studio CMS panel.
            </span>
          </div>
          <button
            onClick={() => setIsCmsOpen(true)}
            className="px-4 py-2 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30 hover:bg-[#22d3ee]/20 text-xs font-editorial font-bold uppercase tracking-wider cursor-pointer"
          >
            OPEN CMS
          </button>
        </div>
      </div>
    </div>
  );
};
