import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, MapPin, Globe2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StudioMascot } from '../mascot/StudioMascot';

export const ContactPage: React.FC = () => {
  const { submitContact } = useStudio();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<'Press' | 'Publishing' | 'Player Support' | 'Partnership' | 'Other'>('Publishing');
  const [budget, setBudget] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    submitContact({
      name,
      email,
      company: company || undefined,
      category,
      subject: subject || `${category} Inquiry from ${name}`,
      message,
      budget: budget || undefined
    });

    setIsSubmitted(true);
  };

  const categories: ('Press' | 'Publishing' | 'Player Support' | 'Partnership' | 'Other')[] = [
    'Publishing',
    'Press',
    'Partnership',
    'Player Support',
    'Other'
  ];

  return (
    <div id="contact-page" className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-12 bg-[#08090d]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ff5722]">
            <Mail size={12} />
            <span>COMMUNICATIONS // OPEN FREQUENCIES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white uppercase tracking-tight leading-[0.92]">
            HAVE AN IDEA? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff8a65] to-[#22d3ee]">
              LET’S TALK.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl">
            Whether you are a platform partner, gaming journalist, composer, publisher, or player with
            a physics inquiry, our frequencies are open. Transmit below.
          </p>
        </div>

        {/* Contact Form & Studio Coordinates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form Area (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#11131c] border border-white/10 p-8 sm:p-12 shadow-2xl relative">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
                    MESSAGE RECEIVED.
                  </h2>
                  <p className="text-zinc-300 font-sans text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-bold">{name}</span>. Your transmission has
                    been recorded in our studio logs. A member of the Brainchild team will respond to{' '}
                    <span className="text-[#22d3ee] font-mono">{email}</span> within 48 hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                    setSubject('');
                    setCompany('');
                    setBudget('');
                  }}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-editorial font-bold text-xs uppercase cursor-pointer"
                >
                  TRANSMIT ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                    TRANSMISSION PURPOSE / NATURE OF INQUIRY *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-editorial tracking-wider transition-all cursor-pointer ${
                          category === cat
                            ? 'bg-[#ff5722] text-white border border-[#ff5722]'
                            : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-white/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">
                      NAME / CODENAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">
                      EMAIL COORDINATES *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">
                      ORGANIZATION / STUDIO (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Sony Interactive / Edge Magazine"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">
                      BUDGET OR SCOPE (IF APPLICABLE)
                    </label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. $50k-$200k or N/A"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">
                    TRANSMISSION SUBJECT
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your message"
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#ff5722]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">
                    MESSAGE / TELEMETRY *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your thoughts, proposal, or question in full..."
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#ff5722]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-white font-editorial font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xl shadow-[#ff5722]/30"
                >
                  <span>TRANSMIT TO STUDIO</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>

          {/* Right Info & Physical Presence (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#11131c] border border-white/10 space-y-6 shadow-xl">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest font-bold">
                  STUDIO HEADQUARTERS
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase">
                  MONTREAL CREATIVE DOCK
                </h3>
              </div>

              <div className="space-y-3 text-xs text-zinc-300 font-sans leading-relaxed">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#ff5722] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Brainchild Games Workshop</span>
                    <br />
                    4200 Boulevard Saint-Laurent, Suite 600
                    <br />
                    Montréal, QC H2W 2R2, Canada
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <Globe2 size={16} className="text-[#22d3ee]" />
                  <span>UTC-5 (Eastern Time) • Core Hours 10:00–16:00</span>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="p-8 rounded-3xl bg-[#11131c] border border-white/10 space-y-4 shadow-xl">
              <div className="text-xs font-mono text-[#fbbf24] uppercase tracking-widest font-bold">
                DIRECT INBOXES
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Press Kit & Interviews:</span>
                  <span className="text-white">press@brainchildgames.com</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Publishing & Platforms:</span>
                  <span className="text-[#22d3ee]">partners@brainchildgames.com</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Careers & Portfolios:</span>
                  <span className="text-white">careers@brainchildgames.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Player Support:</span>
                  <span className="text-[#ff5722]">support@brainchildgames.com</span>
                </div>
              </div>
            </div>

            {/* Mascot interaction */}
            <div className="flex justify-center">
              <StudioMascot mode="floating" showSpeech={true} speechText="Signal strong! Ping anytime." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
