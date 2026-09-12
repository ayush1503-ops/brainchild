import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StudioMascot } from '../mascot/StudioMascot';

export const NewsletterDropSection: React.FC = () => {
  const { subscribeNewsletter } = useStudio();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Beta Access', 'New Game Drops']);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const interestOptions = [
    'Beta Access',
    'New Game Drops',
    'Devlog & Tech',
    'Merch & Vinyl'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', text: 'Please enter your communication frequency (email).' });
      return;
    }

    const res = subscribeNewsletter(name, email, selectedInterests);
    if (res.success) {
      setStatus({ type: 'success', text: res.message });
      setName('');
      setEmail('');
    } else {
      setStatus({ type: 'error', text: res.message });
    }
  };

  return (
    <section
      id="newsletter-drop-section"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#08090d] border-t border-white/10 overflow-hidden"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#ff5722]/10 to-[#22d3ee]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Playful Asymmetric Container with Mascot Interaction */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#12141d] via-[#0f1118] to-[#141624] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ff5722]">
                <Sparkles size={12} />
                <span>DIRECT STUDIO FREQUENCY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
                GET THE <br />
                <span className="text-[#ff5722]">NEXT DROP.</span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-lg">
                Game launches, closed playtests, development stories, and occasional secret prototypes.
                No algorithmic spam, ever.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="sub-name" className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Explorer Handle / Name
                    </label>
                    <input
                      id="sub-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Commander Vance"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white placeholder-zinc-600 text-xs font-sans focus:outline-none focus:border-[#ff5722] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="sub-email" className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Email Coordinates *
                    </label>
                    <input
                      id="sub-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white placeholder-zinc-600 text-xs font-sans focus:outline-none focus:border-[#ff5722] transition-colors"
                    />
                  </div>
                </div>

                {/* Interest Multi-select Pills */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Choose Your Transmission Channels:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((option) => {
                      const isSelected = selectedInterests.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleInterest(option)}
                          className={`px-3 py-1.5 rounded-full text-xs font-editorial tracking-wider transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-[#ff5722] text-white border border-[#ff5722]'
                              : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#ff5722] text-white font-editorial font-bold text-xs tracking-wider uppercase hover:bg-[#f24710] shadow-xl shadow-[#ff5722]/30 transition-all cursor-pointer"
                  >
                    <span>TRANSMIT COORDINATES</span>
                    <Send size={13} />
                  </button>

                  <span className="text-[11px] text-zinc-500 font-sans">
                    Unsubscribe at any moment. Zero tracking trackers.
                  </span>
                </div>

                {/* Status message */}
                {status && (
                  <div
                    className={`p-3 rounded-xl flex items-center gap-2 text-xs font-editorial mt-3 ${
                      status.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{status.text}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Right Mascot Interacting with Drop Area */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <StudioMascot
                mode="floating"
                showSpeech={true}
                speechText="Transmitting drop parcel!"
              />
              <div className="mt-4 text-center">
                <div className="text-[11px] font-mono text-[#22d3ee] uppercase tracking-widest font-semibold">
                  SECURE STUDIO DATABASE
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Exportable via Studio CMS anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
