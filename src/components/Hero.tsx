"use client";

import { useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import Image from "next/image";

export default function Hero() {
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = mascotRef.current;
    if (!element) return;

    let animationId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      const floatY = Math.sin(elapsed * 0.8) * 12;
      const floatX = Math.cos(elapsed * 0.6) * 8;
      const rotate = Math.sin(elapsed * 0.5) * 3;

      element.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${rotate}deg)`;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-studio-accent/5 via-transparent to-studio-secondary/5" />
      
      <div className="absolute top-1/4 right-10 w-64 h-64 opacity-20 blur-3xl bg-studio-accent rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 opacity-15 blur-3xl bg-studio-secondary rounded-full animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-3/5 text-center lg:text-left">
            <p className="text-studio-accent font-medium tracking-wider uppercase text-sm mb-6">
              Modern Game Studio
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-studio-light leading-tight mb-8">
              We craft immersive<br />
              <span className="text-studio-accent">game worlds</span>
            </h1>
            <p className="text-studio-muted text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12">
              Building next-generation experiences where physics, narrative, and player agency collide. From zero-gravity survival to neon-soaked racing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Our Games
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Join the Team
              </Button>
            </div>
          </div>

          <div className="lg:w-2/5 flex justify-center items-center relative" ref={mascotRef}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-studio-accent/20 to-studio-secondary/20 rounded-full blur-2xl opacity-50" />
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-studio-accent/10 to-studio-secondary/10 rounded-full border border-studio-accent/20" />
                <Image
                  src="/images/mascot.png"
                  alt="Studio mascot"
                  fill
                  className="object-contain drop-shadow-[0_20px_40px_rgba(255,51,102,0.3)]"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-studio-accent/10 border border-studio-accent/30 rounded-full flex items-center justify-center">
                <span className="text-studio-accent font-display font-bold text-3xl md:text-4xl">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: "3s" }}>
        <svg className="w-6 h-6 text-studio-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}