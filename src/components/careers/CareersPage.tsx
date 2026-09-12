import React, { useState } from 'react';
import { Briefcase, MapPin, Sparkles, ArrowRight, ShieldCheck, Heart, Coffee } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { JobDetailModal } from './JobDetailModal';
import { StudioMascot } from '../mascot/StudioMascot';

export const CareersPage: React.FC = () => {
  const { jobs, selectedJob, setSelectedJob } = useStudio();
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const departments = ['ALL', 'Engineering', 'Art & Animation', 'Game Design', 'Audio'];

  const filteredJobs = jobs.filter((j) => {
    if (selectedDept === 'ALL') return true;
    return j.department === selectedDept;
  });

  const benefits = [
    {
      icon: <Coffee size={20} className="text-[#ff5722]" />,
      title: '4-Day Work Week',
      desc: 'Monday through Thursday, 36 hours. Fridays are for playing games, hiking, family, or personal prototypes.'
    },
    {
      icon: <Sparkles size={20} className="text-[#22d3ee]" />,
      title: 'Direct Profit Sharing',
      desc: '15% of all studio net revenue from game sales is pooled and distributed directly to team members equally.'
    },
    {
      icon: <ShieldCheck size={20} className="text-[#fbbf24]" />,
      title: 'Zero Crunch Culture',
      desc: 'We scope games to fit life, not the other way around. Milestones shift before sleep does.'
    },
    {
      icon: <Heart size={20} className="text-[#f43f5e]" />,
      title: 'Global Remote Support',
      desc: '$4,000 home office hardware budget, health/dental coverage, ergonomic allowance, and annual studio gatherings.'
    }
  ];

  return (
    <div id="careers-page" className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-12 bg-[#08090d]">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Page Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ff5722]">
              <Briefcase size={12} />
              <span>CAREERS // EXPAND THE EXPEDITION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white uppercase tracking-tight leading-[0.92]">
              BUILD THE NEXT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff8a65] to-[#22d3ee]">
                WORLD WITH US.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl">
              We are seeking curious engineers, environment sculptors, narrative designers, and audio
              architects who want their craft to define an entire genre. Check out our open roles below.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <StudioMascot mode="floating" showSpeech={true} speechText="Looking for fellow travelers!" />
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <div className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest font-bold">
            HOW WE OPERATE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#11131c] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit mb-3">
                    {b.icon}
                  </div>
                  <h3 className="text-base font-display font-bold text-white mb-1">{b.title}</h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Filter & List */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono text-[#ff5722] uppercase tracking-widest font-bold mb-1">
                TRANSMISSIONS
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
                CURRENT EXPEDITIONS ({jobs.filter((j) => j.status === 'open').length})
              </h2>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-full text-xs font-editorial font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#ff5722] text-white shadow-md'
                      : 'bg-[#12141e] text-zinc-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="p-6 sm:p-8 rounded-3xl bg-[#11131c] border border-white/10 hover:border-[#ff5722]/60 hover:bg-[#141724] transition-all duration-300 group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-[#ff5722] font-semibold uppercase">
                      {job.department}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs font-mono text-zinc-400">{job.type}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs font-mono text-[#22d3ee]">{job.experience}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-black text-white group-hover:text-[#ff5722] transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-sans">
                    <MapPin size={13} className="text-zinc-500" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-6 py-3 rounded-full bg-white/5 group-hover:bg-[#ff5722] group-hover:text-white text-xs font-editorial font-bold text-zinc-300 transition-all duration-200 inline-flex items-center gap-2">
                    <span>VIEW DOSSIER & APPLY</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};
