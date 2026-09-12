import React from 'react';
import { Briefcase, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const CareersTeaserSection: React.FC = () => {
  const { jobs, setSelectedJob, setCurrentRoute } = useStudio();
  const openJobs = jobs.filter((j) => j.status === 'open').slice(0, 3);

  return (
    <section
      id="careers-teaser"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#090a0e] border-t border-white/10 overflow-hidden"
    >
      {/* Subtle ambient light */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#22d3ee]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Big Headline Statement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#22d3ee] uppercase">
              <Briefcase size={13} />
              <span>06 / CAREERS & CULTURE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
              COME BUILD <br />
              <span className="text-[#ff5722]">WORLDS</span> <br />
              WITH US.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              We offer 4-day work weeks, zero crunch mandates, profit sharing on every release, and
              the autonomy to build systems you are genuinely proud of.
            </p>

            <div className="pt-2">
              <button
                id="careers-view-all-btn"
                onClick={() => setCurrentRoute('careers')}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-black hover:bg-[#ff5722] hover:text-white font-editorial font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md"
              >
                <span>SEE ALL OPEN POSITIONS ({jobs.length})</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Column: Open Positions List */}
          <div className="lg:col-span-7 space-y-4">
            {openJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="p-6 rounded-2xl bg-[#11131c] border border-white/10 hover:border-[#ff5722]/50 hover:bg-[#141724] transition-all duration-200 group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#ff5722] font-semibold uppercase">
                      {job.department}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[11px] font-mono text-zinc-400">{job.type}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-[#ff5722] transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-sans">
                    <MapPin size={12} className="text-zinc-500" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="flex items-center sm:self-center">
                  <span className="px-4 py-2 rounded-full bg-white/5 group-hover:bg-[#ff5722] group-hover:text-white text-xs font-editorial font-bold text-zinc-300 transition-all duration-200 inline-flex items-center gap-1">
                    APPLY NOW →
                  </span>
                </div>
              </div>
            ))}

            {/* Culture highlight pill */}
            <div className="p-4 rounded-xl bg-[#141724]/60 border border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#fbbf24]" />
                <span>4-DAY WORK WEEKS (36 HRS) • PROFIT SHARING POOL</span>
              </div>
              <span className="hidden sm:inline text-zinc-500">REMOTE FIRST</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
