import React from 'react';
import { ArrowRight, Newspaper, Star, Heart, Play } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useStudio } from '../../context/StudioContext';
import { Sticker } from '../ui/Reveal';
import { ControllerBit, CoinBit, DiceBit, StarSticker, Squiggle, JoystickBit } from '../ui/Bits';
import { platformShort, statusColor } from '../../utils/catalog';

const TICKER = [
  'Aetherbound lands Q4 2026',
  'Good games. Good times.',
  'Solaris Diver 0.8 is live',
  'Player-first, always',
  '4-day work week studio',
  'Void Protocol alpha soon',
  'Handmade in Montreal'
];

export const HeroSection: React.FC = () => {
  const { setCurrentRoute, games, setSelectedGame, toggleWishlist, isWishlisted } = useStudio();
  const featured = games.find((g) => g.featured) || games[0];

  // Gentle 3D tilt on the featured card
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 160, damping: 22 });
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 160, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const wished = featured ? isWishlisted(featured.id) : false;

  return (
    <section id="hero-section" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* Playful background washes */}
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-coral/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-40 h-[28rem] w-[28rem] rounded-full bg-grape/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-40 w-[36rem] -translate-x-1/2 bg-dots opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* LEFT: pitch */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Sticker className="bg-sun text-ink" rotate={-2}>
                <StarSticker className="w-4" /> New release · Aetherbound
              </Sticker>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-7xl xl:text-8xl"
            >
              Play.
              <br />
              <span className="text-grape">Discover.</span>
              <br />
              <span className="relative inline-block text-coral">
                Repeat.
                <Squiggle className="absolute -bottom-3 left-0 h-4 w-full" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-7 max-w-md text-base font-medium leading-relaxed text-inksoft sm:text-lg"
            >
              Brainchild Games is a playful home for handcrafted worlds — sky-island adventures,
              golden-sea expeditions, impossible puzzles and rooftop capers. Pick a card, press start,
              stay a while.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                id="hero-cta-explore"
                onClick={() => setCurrentRoute('games')}
                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-ink bg-coral px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-sticker transition-all hover:-translate-y-1 hover:bg-coraldeep hover:shadow-[6px_6px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-sticker-sm cursor-pointer"
              >
                Explore games
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="hero-cta-news"
                onClick={() => setCurrentRoute('news')}
                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-ink bg-cream px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-ink shadow-sticker transition-all hover:-translate-y-1 hover:bg-sun hover:shadow-[6px_6px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-sticker-sm cursor-pointer"
              >
                <Newspaper size={16} className="transition-transform group-hover:-rotate-12" />
                Latest news
              </button>
            </motion.div>

            {/* Playful proof chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-wider text-inksoft"
            >
              <span className="inline-flex items-center gap-1.5">
                <Star size={13} className="fill-sun text-sun" /> 4.8 average rating
              </span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>120k players</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>4 handmade worlds</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>Made in Montreal</span>
            </motion.div>
          </div>

          {/* RIGHT: floating featured game card */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            {/* decorative halo */}
            <div className="pointer-events-none absolute -inset-6 -rotate-3 rounded-[40px] bg-grape/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-8 -top-10 hidden sm:block" aria-hidden="true">
              <ControllerBit className="w-20 animate-float" />
            </div>
            <div className="pointer-events-none absolute -left-10 bottom-8 hidden sm:block" aria-hidden="true">
              <JoystickBit className="w-14 animate-float-slow" />
            </div>
            <div className="pointer-events-none absolute -bottom-8 right-10 hidden sm:block" aria-hidden="true">
              <DiceBit className="w-12 animate-bob" />
            </div>

            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 34, rotate: 1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                style={{ rotateX, rotateY, transformPerspective: 1100 }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="relative rounded-[30px] border-2 border-ink bg-cream p-4 shadow-lift">
                  {/* art */}
                  <div className="relative overflow-hidden rounded-[20px] border-2 border-ink/10">
                    <img
                      src={featured.heroImage}
                      alt={`${featured.title} key art`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span
                      className={`absolute left-3 top-3 -rotate-3 rounded-full border-2 border-ink px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sticker-sm ${statusColor(
                        featured.status
                      )}`}
                    >
                      {featured.status}
                    </span>
                    <span className="absolute right-3 top-3 rotate-6 rounded-full border-2 border-ink bg-sun px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sticker-sm">
                      Featured
                    </span>
                  </div>

                  {/* body */}
                  <div className="space-y-3 px-2 pb-2 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-grape px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                        {featured.genre}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-extrabold text-ink">
                        <Star size={14} className="fill-sun text-sun" />
                        {featured.rating?.toFixed(1) ?? '4.9'}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
                        {featured.title}
                      </h2>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-inksoft">
                        {featured.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => setSelectedGame(featured)}
                        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-grape px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sticker-sm transition-all hover:-translate-y-0.5 hover:bg-grapedeep active:translate-y-0 cursor-pointer"
                      >
                        <Play size={13} className="fill-white" /> Play now
                      </button>
                      <button
                        onClick={() => toggleWishlist(featured.id)}
                        aria-label="Toggle wishlist"
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink transition-all hover:scale-105 cursor-pointer ${
                          wished ? 'bg-coral text-white' : 'bg-cream text-ink'
                        }`}
                      >
                        <Heart size={17} className={wished ? 'fill-white' : ''} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-dashed border-ink/15 pt-3 text-[11px] font-bold uppercase tracking-wider text-inksoft">
                      <span>{platformShort(featured.platforms)}</span>
                      <span className="text-ink">{featured.releaseYear}</span>
                    </div>
                  </div>
                </div>

                {/* floating stickers on the card */}
                <span className="absolute -left-5 top-16 hidden -rotate-6 rounded-full border-2 border-ink bg-lime px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink shadow-sticker-sm animate-bob sm:block">
                  98% love it
                </span>
                <span className="absolute -right-4 bottom-24 hidden rotate-6 rounded-full border-2 border-ink bg-cream px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink shadow-sticker-sm animate-float sm:block">
                  Editor’s pick
                </span>
                <CoinBit className="absolute -top-6 left-10 w-10 animate-float-slow" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Ticker marquee */}
      <div className="relative mt-16 sm:mt-20 -rotate-1 border-y-2 border-ink bg-ink py-3.5">
        <div className="flex w-max animate-marquee items-center gap-10 pr-10">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-xs font-extrabold uppercase tracking-[0.2em] text-paper">
              {item}
              <StarSticker className="w-4" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
