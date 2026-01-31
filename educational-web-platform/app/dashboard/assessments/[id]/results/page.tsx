"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  mockAssessments,
  mockConcepts,
  mockMentors,
  mockLearningResources,
} from "@/lib/data";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Play,
  FileText,
  MousePointerClick,
  Star,
  Users,
} from "lucide-react";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { assessmentResults } = useApp();

  const assessment = mockAssessments.find((a) => a.id === id);
  const result = assessmentResults.find((r) => r.assessmentId === id);

  if (!assessment || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Results not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/assessments">Back to Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weakConcepts = result.conceptScores.filter((c) => c.status === "weak");
  const moderateConcepts = result.conceptScores.filter((c) => c.status === "moderate");
  const strongConcepts = result.conceptScores.filter((c) => c.status === "strong");

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "article":
        return FileText;
      case "exercise":
        return BookOpen;
      case "interactive":
        return MousePointerClick;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/assessments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assessments
            </Link>
          </Button>
          <h1 className="font-semibold text-foreground">{assessment.title} - Results</h1>
          <div />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  result.score >= 80
                    ? "bg-success/10"
                    : result.score >= 60
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    result.score >= 80
                      ? "text-success"
                      : result.score >= 60
                        ? "text-warning-foreground"
                        : "text-destructive"
                  }`}
                >
                  {result.score}%
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good Progress" : "Needs Work"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <p className="text-lg font-semibold text-foreground">{result.timeTaken} minutes</p>
                <p className="text-xs text-muted-foreground">of {assessment.duration} min allowed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concepts Analyzed</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.conceptScores.length} concepts
                </p>
                <p className="text-xs text-muted-foreground">
                  {strongConcepts.length} strong, {weakConcepts.length} weak
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Concept Breakdown</CardTitle>
                <CardDescription>
                  See how you performed in each concept area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.conceptScores.map((cs) => {
                    const concept = mockConcepts.find((c) => c.id === cs.conceptId);
                    return (
                      <div key={cs.conceptId}>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {cs.status === "weak" ? (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            ) : cs.status === "strong" ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <TrendingUp className="h-5 w-5 text-warning" />
                            )}
                            <span className="font-medium text-foreground">{concept?.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {concept?.difficulty}
                            </Badge>
                          </div>
                          <span
                            className={`font-semibold ${
                              cs.status === "weak"
                                ? "text-destructive"
                                : cs.status === "strong"
                                  ? "text-success"
                                  : "text-warning-foreground"
                            }`}
                          >
                            {cs.score}%
                          </span>
                        </div>
                        <Progress
                          value={cs.score}
                          className={`h-3 ${
                            cs.status === "weak"
                              ? "[&>div]:bg-destructive"
                              : cs.status === "strong"
                                ? "[&>div]:bg-success"
                                : "[&>div]:bg-warning"
                          }`}
                        />
                        <p className="mt-1 text-sm text-muted-foreground">{concept?.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {weakConcepts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Recommended Learning Resources
                  </CardTitle>
                  <CardDescription>
                    Focus on these resources to improve your weak areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weakConcepts.map((wc) => {
                      const concept = mockConcepts.find((c) => c.id === wc.conceptId);
                      const resources = mockLearningResources.filter(
                        (r) => r.conceptId === wc.conceptId
                      );

                      return (
                        <div key={wc.conceptId} className="rounded-lg border border-border p-4">
                          <h4 className="mb-3 font-semibold text-foreground">{concept?.name}</h4>
                          <div className="space-y-2">
                            {resources.map((resource, idx) => {
                              const Icon = getResourceIcon(resource.type);
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                      <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">{resource.title}</p>
                                      <p className="text-xs text-muted-foreground capitalize">
                                        {resource.type}
                                        {resource.duration && ` - ${resource.duration}`}
                                        {resource.questions && ` - ${resource.questions} questions`}
                                        {resource.readTime && ` - ${resource.readTime} read`}
                                      </p>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    Start
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {weakConcepts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Recommended Mentors
                  </CardTitle>
                  <CardDescription>
                    Get personalized help from experts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMentors
                      .filter((m) =>
                        weakConcepts.some((wc) => {
                          const concept = mockConcepts.find((c) => c.id === wc.conceptId);
                          return m.expertise.some(
                            (e) =>
                              concept?.name &&
                              (e.toLowerCase().includes(concept.name.toLowerCase()) ||
                                concept.name.toLowerCase().includes(e.toLowerCase()))
                          );
                        })
                      )
                      .slice(0, 2)
                      .map((mentor) => (
                        <div key={mentor.id} className="rounded-lg border border-border p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full">
                              <Image
                                src={mentor.avatar || "/placeholder.svg"}
                                alt={mentor.name}
                                fill
                                className="object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{mentor.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-warning text-warning" />
                                <span className="text-sm text-foreground">{mentor.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {mentor.expertise.slice(0, 3).map((e) => (
                              <Badge key={e} variant="secondary" className="text-xs">
                                {e}
                              </Badge>
                            ))}
                          </div>
                          <Button asChild className="mt-4 w-full" size="sm">
                            <Link href="/dashboard/mentors">Book Session</Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weakConcepts.length > 0 && (
                  <Button asChild className="w-full" variant="default">
                    <Link href="/dashboard/mentors">Book a Mentor Session</Link>
                  </Button>
                )}
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/dashboard/progress">View Progress Over Time</Link>
                </Button>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/dashboard/assessments">Take Another Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
