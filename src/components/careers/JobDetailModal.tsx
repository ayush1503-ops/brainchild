import React, { useState } from 'react';
import { X, MapPin, Briefcase, CheckCircle2, Send, Upload, Sparkles } from 'lucide-react';
import { Job } from '../../types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // keep submitted state for confirmation view
    }, 500);
  };

  return (
    <div
      id="job-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-start justify-center p-2 sm:p-6 lg:p-10 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e1017] border border-white/15 shadow-2xl overflow-hidden text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/70 hover:bg-[#ff5722] text-white border border-white/20 transition-colors cursor-pointer"
          aria-label="Close vacancy detail"
        >
          <X size={20} />
        </button>

        {/* Header Hero Area */}
        <div className="p-6 sm:p-10 lg:p-12 border-b border-white/10 space-y-4 bg-gradient-to-br from-[#141724] to-[#0e1017]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5722] text-white">
              {job.department}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-zinc-300">
              {job.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-[#22d3ee]">
              {job.experience} Level
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <MapPin size={13} className="text-[#ff5722]" />
            <span>{job.location}</span>
            <span>•</span>
            <span>POSTED: {job.postedDate}</span>
          </div>

          {!showApplyForm && !submitted && (
            <div className="pt-4">
              <button
                onClick={() => setShowApplyForm(true)}
                className="px-7 py-3.5 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-white font-editorial font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xl shadow-[#ff5722]/30"
              >
                APPLY FOR THIS ROLE →
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-10">
          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white uppercase">
                APPLICATION TRANSMITTED
              </h2>
              <p className="text-sm text-zinc-300 font-sans max-w-md mx-auto">
                Thank you, {applicantName || 'Applicant'}. Our recruitment team and department lead
                will review your materials within 5 business days.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white text-black font-editorial font-bold text-xs uppercase"
              >
                CLOSE WINDOW
              </button>
            </div>
          ) : showApplyForm ? (
            /* Application Form */
            <form onSubmit={handleApply} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-white uppercase">
                  SUBMIT APPLICATION: {job.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="text-xs font-editorial text-zinc-400 hover:text-white"
                >
                  ← Back to description
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-[#141622] border border-white/10 text-white text-xs focus:border-[#ff5722] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="jane@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#141622] border border-white/10 text-white text-xs focus:border-[#ff5722] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">PORTFOLIO / GITHUB / ARTSTATION URL *</label>
                <input
                  type="url"
                  required
                  value={applicantPortfolio}
                  onChange={(e) => setApplicantPortfolio(e.target.value)}
                  placeholder="https://artstation.com/... or https://github.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-[#141622] border border-white/10 text-white text-xs focus:border-[#ff5722] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">NOTE OR INTRODUCTION (OPTIONAL)</label>
                <textarea
                  rows={4}
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="Tell us about a favorite mechanic, a game world that inspired you, or why you'd like to work with Brainchild."
                  className="w-full px-4 py-3 rounded-xl bg-[#141622] border border-white/10 text-white text-xs focus:border-[#ff5722] focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload size={18} className="text-[#22d3ee]" />
                  <span className="text-xs text-zinc-300 font-sans">
                    Resume / CV (PDF, DOCX up to 10MB)
                  </span>
                </div>
                <span className="text-xs font-mono text-[#ff5722] cursor-pointer hover:underline">
                  Browse Files
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-xs font-editorial uppercase font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-white text-xs font-editorial uppercase font-bold shadow-xl shadow-[#ff5722]/30 flex items-center gap-2"
                >
                  <span>SEND TRANSMISSION</span>
                  <Send size={13} />
                </button>
              </div>
            </form>
          ) : (
            /* Role Details */
            <>
              {/* About Role */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono text-[#ff5722] uppercase tracking-widest font-bold">
                  ABOUT THE ROLE
                </h3>
                <p className="text-base text-zinc-300 font-sans leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono text-[#22d3ee] uppercase tracking-widest font-bold">
                  CORE RESPONSIBILITIES
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mt-2 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono text-[#fbbf24] uppercase tracking-widest font-bold">
                  REQUIREMENTS
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Perks */}
              <div className="p-6 rounded-2xl bg-[#141624] border border-white/10 space-y-3">
                <h3 className="text-sm font-mono text-white uppercase tracking-widest font-bold flex items-center gap-2">
                  <Sparkles size={14} className="text-[#ff5722]" /> WHAT WE OFFER
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {job.perks.map((perk, i) => (
                    <div key={i} className="text-xs text-zinc-300 font-sans flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">
                  REF NO: {job.id.toUpperCase()}
                </span>
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="px-6 py-3 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-white font-editorial font-bold text-xs uppercase tracking-wider"
                >
                  APPLY FOR THIS ROLE →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
