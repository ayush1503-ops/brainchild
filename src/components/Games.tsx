"use client";

import { games, type Game } from "@/data/games";
import { Button } from "./ui/Button";
import Image from "next/image";

export default function Games() {
  return (
    <section className="py-24 md:py-32 px-6 bg-studio-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-studio-accent font-medium tracking-wider uppercase text-sm mb-4">Our Games</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-studio-light mb-6">
            Worlds waiting to<br />be explored
          </h2>
          <p className="text-studio-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Each project is built with obsession over detail, physics, and player agency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {games.map((game: Game) => (
            <article
              key={game.id}
              className="relative group bg-studio-dark/50 border border-studio-muted/20 rounded-2xl overflow-hidden hover:border-studio-accent/50 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-studio-dark/20 to-studio-dark/80 z-10" />
                <Image
                  src={game.coverImage}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                    game.status === "Released"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : game.status === "Early Access"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-studio-accent/20 text-studio-accent border border-studio-accent/30"
                  }`}>
                    {game.status}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.genre.map((genre) => (
                    <span
                      key={genre}
                      className="px-2.5 py-1 text-xs font-medium text-studio-muted bg-studio-light/5 rounded border border-studio-muted/10"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-studio-light mb-3">
                  {game.title}
                </h3>
                <p className="text-studio-accent font-medium mb-4">{game.tagline}</p>
                <p className="text-studio-muted leading-relaxed mb-6">{game.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-studio-muted/10">
                  <span className="text-studio-muted text-sm">Target: {game.releaseDate}</span>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="ghost" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}