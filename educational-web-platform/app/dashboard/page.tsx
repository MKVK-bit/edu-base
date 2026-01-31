"use client";

import React from "react"

import { useApp } from "@/lib/app-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  ClipboardList,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { mockConcepts, mockAssessments, mockMentors } from "@/lib/data";

export default function DashboardPage() {
  const { user, assessmentResults, bookings, certificates, progressHistory } = useApp();

  const weakConcepts = assessmentResults
    .flatMap((r) => r.conceptScores)
    .filter((c) => c.status === "weak");

  const strongConcepts = assessmentResults
    .flatMap((r) => r.conceptScores)
    .filter((c) => c.status === "strong");

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");

  const latestResult = assessmentResults[assessmentResults.length - 1];

  const overallProgress =
    progressHistory.length > 0
      ? Math.round(
          progressHistory.slice(-5).reduce((acc, p) => acc + p.score, 0) /
            Math.min(progressHistory.length, 5)
        )
      : 0;

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Student"}`}
        description="Track your learning progress and continue your journey"
      />

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ClipboardList}
            label="Assessments Taken"
            value={assessmentResults.length}
            description={`${mockAssessments.length - assessmentResults.length} remaining`}
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Progress"
            value={`${overallProgress}%`}
            description="Across all concepts"
          />
          <StatCard
            icon={Calendar}
            label="Upcoming Sessions"
            value={upcomingBookings.length}
            description={upcomingBookings.length > 0 ? "With mentors" : "Book a mentor"}
          />
          <StatCard
            icon={Award}
            label="Certificates Earned"
            value={certificates.length}
            description="Skills validated"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Concept Mastery</CardTitle>
                <CardDescription>Your strengths and areas for improvement</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/progress">View Details</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {assessmentResults.length > 0 ? (
                <div className="space-y-4">
                  {latestResult?.conceptScores.map((cs) => {
                    const concept = mockConcepts.find((c) => c.id === cs.conceptId);
                    return (
                      <div key={cs.conceptId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {cs.status === "weak" ? (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : cs.status === "strong" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-warning" />
                            )}
                            <span className="font-medium text-foreground">
                              {concept?.name || cs.conceptId}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">{cs.score}%</span>
                        </div>
                        <Progress
                          value={cs.score}
                          className={`h-2 ${
                            cs.status === "weak"
                              ? "[&>div]:bg-destructive"
                              : cs.status === "strong"
                                ? "[&>div]:bg-success"
                                : "[&>div]:bg-warning"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Take an assessment to see your concept mastery</p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/assessments">Start Assessment</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link href="/dashboard/assessments">
                  Take Assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {weakConcepts.length > 0 && (
                <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                  <Link href="/dashboard/mentors">
                    Book a Mentor
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link href="/dashboard/progress">
                  View Progress
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link href="/dashboard/certificates">
                  View Certificates
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Areas Needing Attention</CardTitle>
                <CardDescription>Focus on these concepts to improve</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {weakConcepts.length > 0 ? (
                <div className="space-y-4">
                  {weakConcepts.slice(0, 3).map((wc) => {
                    const concept = mockConcepts.find((c) => c.id === wc.conceptId);
                    const mentor = mockMentors.find((m) =>
                      m.expertise.some(
                        (e) => concept?.name && e.toLowerCase().includes(concept.name.toLowerCase())
                      )
                    );
                    return (
                      <div
                        key={wc.conceptId}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <p className="font-medium text-foreground">{concept?.name}</p>
                          <p className="text-sm text-muted-foreground">{concept?.subject}</p>
                        </div>
                        {mentor && (
                          <Button asChild size="sm">
                            <Link href="/dashboard/mentors">Get Help</Link>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
                  <p className="text-muted-foreground">
                    {assessmentResults.length > 0
                      ? "Great job! No weak areas identified."
                      : "Complete an assessment to identify areas for improvement."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled mentor sessions</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/mentors">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const mentor = mockMentors.find((m) => m.id === booking.mentorId);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <p className="font-medium text-foreground">{mentor?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.concept} - {booking.subject}
                          </p>
                          <p className="text-sm text-primary">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No upcoming sessions scheduled</p>
                  <Button asChild className="mt-4 bg-transparent" variant="outline">
                    <Link href="/dashboard/mentors">Book a Mentor</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
