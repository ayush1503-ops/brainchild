import React from 'react';
import { Newspaper, ArrowRight, Clock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const LatestNewsSection: React.FC = () => {
  const { news, setSelectedArticle, setCurrentRoute } = useStudio();

  // Published articles only
  const published = news.filter((a) => a.published);
  const featuredArticle = published.find((a) => a.featured) || published[0];
  const sideArticles = published.filter((a) => a.id !== featuredArticle?.id).slice(0, 3);

  return (
    <section
      id="latest-news-section"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#0a0b10] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#ff5722] uppercase">
              <Newspaper size={13} />
              <span>05 / EDITORIAL DESK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              LATEST FROM THE STUDIO
            </h2>
          </div>

          <button
            onClick={() => setCurrentRoute('news')}
            className="inline-flex items-center gap-2 text-xs font-editorial font-bold tracking-widest text-zinc-300 hover:text-[#ff5722] uppercase transition-colors cursor-pointer group"
          >
            <span>VIEW ALL DISPATCHES</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Magazine Editorial Layout: Big Feature + Side Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Cover Article (7 Cols) */}
          {featuredArticle && (
            <div
              onClick={() => setSelectedArticle(featuredArticle)}
              className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#11131c] border border-white/10 hover:border-[#ff5722]/50 transition-all duration-300 group cursor-pointer shadow-2xl flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-[#ff5722] text-white font-bold shadow-md">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mb-3">
                    <span>{featuredArticle.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Clock size={12} className="text-[#22d3ee]" /> {featuredArticle.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#ff5722] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-zinc-400 font-sans">
                    By <span className="text-white font-medium">{featuredArticle.author.name}</span> (
                    {featuredArticle.author.role})
                  </div>
                  <span className="text-xs font-editorial font-bold text-[#ff5722] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    READ STORY →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Side Editorial Stack (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {sideArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-5 sm:p-6 rounded-2xl bg-[#11131c]/80 border border-white/10 hover:border-white/30 hover:bg-[#141724] transition-all duration-200 group cursor-pointer flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                    <span className="text-[#22d3ee] font-semibold">{article.category}</span>
                    <span className="text-[11px] text-zinc-500">{article.date}</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-[#ff5722] transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="mt-2 text-xs text-zinc-400 font-sans line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{article.readTime}</span>
                  <span className="text-zinc-300 group-hover:text-white font-editorial font-semibold">
                    READ →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
