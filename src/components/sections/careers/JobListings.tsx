"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JobListing } from "@/types";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { JobApplicationModal } from "./JobApplicationModal";

interface JobListingsProps {
  jobs: JobListing[];
}

export function JobListings({ jobs }: JobListingsProps) {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal>
          <SectionHeading
            eyebrow="Open Positions"
            title="Find Your Role"
            accent="at the Grill"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {jobs.map((job, index) => (
            <Reveal key={job.id} delay={index * 0.1}>
              <Card className="flex h-full flex-col gap-4 border-l-4 border-l-[var(--accent-orange)] rounded-r-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-6 transition-colors hover:bg-[var(--bg-surface-hover)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--accent-peach)]">
                      {job.department}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface-raised)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {job.type}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[var(--text-body)]">
                  {job.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-warm)]">
                  <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Posted {new Date(job.postedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApply(job)}
                    className="ml-auto rounded-xl flex items-center gap-1.5 text-xs font-bold uppercase"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Apply Now
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      <JobApplicationModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </section>
  );
}
