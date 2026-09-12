import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const IntroductionSection: React.FC = () => {
  const { setCurrentRoute } = useStudio();

  const principles = [
    {
      num: '01',
      title: 'Kinetic Tactility',
      subtitle: 'Physics before script',
      desc: 'We obsess over weight, momentum, and tactile drag before writing dialogue. A character should feel physically grounded in the dirt and zero-g atmosphere of the world.'
    },
    {
      num: '02',
      title: 'Atmospheric Architecture',
      subtitle: 'Environments as characters',
      desc: 'Worlds built like living sculptural installations—volumetric solar light, dynamic weather systems, and acoustic spatial foley that communicates scale without exposition.'
    },
    {
      num: '03',
      title: 'Authorial Autonomy',
      subtitle: 'No algorithmic design',
      desc: 'No focus-group homogeny or metric-chasing retainment loops. We pursue strange, specific questions that produce gameplay sensations players remember for decades.'
    }
  ];

  return (
    <section
      id="studio-introduction"
      className="relative py-32 px-4 sm:px-6 lg:px-12 bg-[#090a0d] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="max-w-4xl space-y-6">
          <div className="text-xs font-mono tracking-widest text-[#ff5722] uppercase">
            01 / MANIFESTO & PHILOSOPHY
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.02] tracking-tight text-white uppercase">
            WE DON’T JUST BUILD GAMES.{' '}
            <span className="text-zinc-400">WE CRAFT WORLDS</span> YOU WANT TO INHABIT.
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl">
            Founded in Montreal in 2019, Brainchild Games is a collective of 28 artisans, systems
            architects, composers, and sculptors. We make titles that reward unhurried curiosity and
            treat games as a premier artistic medium.
          </p>
        </div>

        {/* 3 Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {principles.map((p) => (
            <div
              key={p.num}
              className="p-8 rounded-2xl bg-[#11131c] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between space-y-8 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#ff5722] font-semibold">{p.num}</span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    {p.subtitle}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-white group-hover:text-[#ff5722] transition-colors">
                  {p.title}
                </h3>

                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-zinc-400 uppercase">
                STUDIO DISCIPLINE
              </div>
            </div>
          ))}
        </div>

        {/* Bottom studio origin link */}
        <div className="pt-4 flex items-center justify-between border-t border-white/10">
          <span className="text-xs font-mono text-zinc-400">
            28 CREATORS • MONTREAL & GLOBAL
          </span>

          <button
            onClick={() => setCurrentRoute('about')}
            className="inline-flex items-center gap-2 text-xs font-editorial font-bold text-white hover:text-[#ff5722] uppercase tracking-widest transition-colors cursor-pointer"
          >
            <span>ABOUT OUR CRAFT & TIMELINE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
