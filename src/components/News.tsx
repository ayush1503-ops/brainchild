"use client";

import { articles, type Article } from "@/data/news";
import { Button } from "./ui/Button";
import Image from "next/image";

export default function News() {
  return (
    <section className="py-24 md:py-32 px-6 bg-studio-dark/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-studio-accent font-medium tracking-wider uppercase text-sm mb-4">Latest Updates</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-studio-light">
              Studio<br />Journal
            </h2>
          </div>
          <Button variant="ghost" size="md" className="md:hidden w-full md:w-auto mt-4">
            View All Articles
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article: Article) => (
            <article
              key={article.id}
              className="group bg-studio-dark border border-studio-muted/20 rounded-2xl overflow-hidden hover:border-studio-accent/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <time className="text-studio-muted text-sm mb-3" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <h3 className="font-display text-xl md:text-2xl font-bold text-studio-light mb-3 group-hover:text-studio-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-studio-muted leading-relaxed mb-6 flex-1">{article.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-studio-muted/10">
                  <span className="text-studio-muted/70 text-sm">{article.author}</span>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16 md:hidden">
          <Button variant="ghost" size="lg">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}