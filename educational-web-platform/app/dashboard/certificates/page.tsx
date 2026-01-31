"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/app-context";
import type { Certificate } from "@/lib/data";
import {
  Award,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Quote,
} from "lucide-react";

export default function CertificatesPage() {
  const { certificates, user } = useApp();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Certificates"
        description="Your earned skill certificates validated by mentor feedback"
      />

      <div className="p-6">
        <div className="mb-8 rounded-lg bg-primary/5 border border-primary/20 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            How Certificates Work
          </h2>
          <p className="text-muted-foreground">
            EduBase certificates are earned through demonstrated improvement in specific skills,
            validated by mentor feedback. Unlike traditional certificates based solely on exam scores,
            these reflect true understanding and real progress in your learning journey.
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => setSelectedCertificate(cert)}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-10 w-10 text-primary" />
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="mb-2">{cert.subject}</Badge>
                    <h3 className="text-xl font-bold text-foreground">{cert.skill}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Awarded to {cert.studentName}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(cert.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-success">+{cert.improvementPercentage}%</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      Validated by {cert.mentorName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Award className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No Certificates Yet</h3>
              <p className="mt-2 max-w-md text-center text-muted-foreground">
                Complete assessments, work with mentors, and demonstrate real improvement
                to earn your first skill certificate.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Take diagnostic assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Work with mentors on weak areas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Show consistent improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Receive mentor validation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="sr-only">Certificate Details</DialogTitle>
            </DialogHeader>
            {selectedCertificate && (
              <div className="relative">
                <div className="rounded-lg border-4 border-primary/20 bg-card p-8">
                  <div className="absolute -left-2 -top-2 h-8 w-8 border-l-4 border-t-4 border-primary rounded-tl-lg" />
                  <div className="absolute -right-2 -top-2 h-8 w-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-2 -left-2 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

                  <div className="text-center">
                    <div className="mb-6 flex items-center justify-center gap-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span className="text-lg font-semibold text-primary">EduBase</span>
                    </div>

                    <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                      Certificate of Achievement
                    </h2>

                    <div className="my-6 flex justify-center">
                      <Award className="h-16 w-16 text-primary" />
                    </div>

                    <p className="text-muted-foreground">This certifies that</p>
                    <h3 className="mt-2 text-3xl font-bold text-foreground">
                      {selectedCertificate.studentName}
                    </h3>

                    <p className="mt-4 text-muted-foreground">
                      has demonstrated proficiency and real improvement in
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold text-primary">
                      {selectedCertificate.skill}
                    </h4>
                    <Badge className="mt-2">{selectedCertificate.subject}</Badge>

                    <div className="my-6 flex items-center justify-center gap-2 rounded-lg bg-success/10 px-4 py-2">
                      <TrendingUp className="h-5 w-5 text-success" />
                      <span className="font-semibold text-success">
                        {selectedCertificate.improvementPercentage}% Improvement Demonstrated
                      </span>
                    </div>

                    <div className="my-6 rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <Quote className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Mentor Feedback
                        </span>
                      </div>
                      <p className="italic text-muted-foreground">
                        "{selectedCertificate.mentorFeedback}"
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        - {selectedCertificate.mentorName}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground">Issue Date</p>
                        <p>{new Date(selectedCertificate.issuedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Certificate ID</p>
                        <p className="font-mono text-xs">{selectedCertificate.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
