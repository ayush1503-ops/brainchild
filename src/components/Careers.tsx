"use client";

import { jobs, type Job } from "@/data/careers";
import { Button } from "./ui/Button";

export default function Careers() {
  return (
    <section className="py-24 md:py-32 px-6 bg-studio-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-studio-accent font-medium tracking-wider uppercase text-sm mb-4">Careers</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-studio-light mb-6">
            Shape the future<br />of play
          </h2>
          <p className="text-studio-muted text-lg max-w-2xl mx-auto leading-relaxed">
            We are a small, passionate team looking for exceptional talent to help build the impossible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {jobs.map((job: Job) => (
            <article
              key={job.id}
              className="bg-studio-dark/50 border border-studio-muted/20 rounded-2xl p-6 md:p-8 hover:border-studio-accent/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-medium text-studio-accent bg-studio-accent/10 rounded-full border border-studio-accent/20">
                  {job.department}
                </span>
                <span className="px-3 py-1 text-xs font-medium text-studio-muted bg-studio-light/5 rounded-full border border-studio-muted/10">
                  {job.type}
                </span>
              </div>

              <h3 className="font-display text-xl md:text-2xl font-bold text-studio-light mb-2">
                {job.title}
              </h3>
              <p className="text-studio-muted/70 text-sm mb-4">{job.location}</p>
              <p className="text-studio-muted leading-relaxed mb-6">{job.description}</p>

              <div className="mb-6">
                <h4 className="text-studio-light text-sm font-medium mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-studio-muted text-sm">
                      <span className="text-studio-accent mt-1 flex-shrink-0">→</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="secondary" className="w-full">
                Apply Now
              </Button>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-studio-muted mb-6 max-w-xl mx-auto">
            Don't see a role that fits? We're always interested in hearing from talented people who share our vision.
          </p>
          <Button variant="ghost" size="lg">
            Send Open Application
          </Button>
        </div>
      </div>
    </section>
  );
}