import React from 'react';
import { X, Clock, User, Share2, Tag, BookOpen } from 'lucide-react';
import { Article } from '../../types';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div
      id="article-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-start justify-center p-2 sm:p-6 lg:p-10 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e1017] border border-white/15 shadow-2xl overflow-hidden text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/70 hover:bg-[#ff5722] text-white border border-white/20 transition-colors cursor-pointer"
          aria-label="Close article"
        >
          <X size={20} />
        </button>

        {/* Cover Image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/30 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5722] text-white">
              {article.category}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-8">
          {/* Metadata & Headline */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span>{article.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#22d3ee]">
                <Clock size={12} /> {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Author info */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#181a26] border border-[#ff5722]/50 flex items-center justify-center text-[#ff5722]">
                  <User size={18} />
                </div>
                <div>
                  <div className="text-sm font-editorial font-bold text-white">
                    {article.author.name}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {article.author.role}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                title="Share link"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="prose prose-invert max-w-none space-y-6 text-zinc-300 font-sans leading-relaxed text-base sm:text-lg">
            {article.content.split('\n\n').map((para, i) => {
              if (para.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-xl sm:text-2xl font-display font-bold text-white pt-4 text-[#22d3ee]">
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
              <Tag size={12} /> TAGS:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
