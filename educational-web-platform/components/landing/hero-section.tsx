"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Identify learning gaps early",
  "Personalized recommendations",
  "Expert mentor support",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">New</span>
            <span className="text-xs text-foreground">AI-powered learning gap analysis</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Build Strong Foundations for{" "}
            <span className="text-primary">Lifelong Learning</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl text-pretty">
            EduBase identifies what students truly understand, pinpoints their learning gaps,
            and provides personalized paths to mastery with expert mentor support.
          </p>
          
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/login">
                Start Your Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/5">
            <div className="rounded-xl bg-muted/50 p-4 md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard number="94%" label="Students show improvement" />
                <StatCard number="2.5x" label="Faster gap identification" />
                <StatCard number="500+" label="Expert mentors available" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-lg bg-card p-6 text-center shadow-sm">
      <p className="text-3xl font-bold text-primary md:text-4xl">{number}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
