import React, { useState } from 'react';
import { Newspaper, Clock, Search, ArrowRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ArticleDetailModal } from './ArticleDetailModal';

export const NewsPage: React.FC = () => {
  const { news, selectedArticle, setSelectedArticle } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const published = news.filter((a) => a.published);

  const categories = ['ALL', 'DEVLOG', 'BEHIND THE SCENES', 'ANNOUNCEMENT', 'STUDIO'];

  const filteredNews = published.filter((art) => {
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featured = published.find((a) => a.featured) || published[0];

  return (
    <div id="news-page" className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-12 bg-[#08090d]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ff5722]">
            <Newspaper size={12} />
            <span>DISPATCHES // DEVLOGS & TRANSMISSIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
            FROM THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff8a65] to-[#22d3ee]">
              STUDIO.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-2xl">
            A peek behind the blast doors. Deep technical writeups on physics solvers, worldbuilding
            philosophies, sound design, and progress milestones across all active projects.
          </p>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-editorial font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/30'
                    : 'text-zinc-400 hover:text-white bg-[#12141d] border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dispatches..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#12141d] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5722]"
            />
          </div>
        </div>

        {/* Featured Cover Story */}
        {featured && selectedCategory === 'ALL' && !searchQuery && (
          <div
            onClick={() => setSelectedArticle(featured)}
            className="rounded-3xl overflow-hidden bg-[#11131c] border border-white/15 hover:border-[#ff5722]/60 transition-all duration-500 group cursor-pointer shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#ff5722] text-white font-bold">
                  COVER STORY // {featured.category}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#22d3ee]">
                    <Clock size={12} /> {featured.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-display font-black text-white group-hover:text-[#ff5722] transition-colors leading-snug">
                  {featured.title}
                </h2>

                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-zinc-400 font-sans">
                  By <span className="text-white font-medium">{featured.author.name}</span>
                </div>
                <span className="text-xs font-editorial font-bold text-[#ff5722] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  READ ARTICLE →
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="rounded-3xl overflow-hidden bg-[#11131c] border border-white/10 hover:border-[#ff5722]/50 transition-all duration-300 group cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-black/80 backdrop-blur-md text-[#ff5722] border border-[#ff5722]/30 font-bold">
                      {art.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>{art.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-[#22d3ee]" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-[#ff5722] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-sans text-[11px]">{art.author.name}</span>
                <span className="font-editorial font-bold text-[#ff5722] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  READ →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal reader */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};
