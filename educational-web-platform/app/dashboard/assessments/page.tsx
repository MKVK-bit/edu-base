"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, FileQuestion, CheckCircle2 } from "lucide-react";
import { mockAssessments, mockConcepts } from "@/lib/data";
import { useApp } from "@/lib/app-context";

export default function AssessmentsPage() {
  const { assessmentResults } = useApp();

  const completedAssessmentIds = assessmentResults.map((r) => r.assessmentId);

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Diagnostic Assessments"
        description="Take concept-based tests to identify your learning gaps"
      />

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">How Assessments Work</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Our assessments focus on understanding, not memorization. Each test evaluates specific
            concepts to pinpoint exactly where you excel and where you need support. Results help
            personalize your learning path.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockAssessments.map((assessment) => {
            const isCompleted = completedAssessmentIds.includes(assessment.id);
            const concepts = assessment.concepts
              .map((cId) => mockConcepts.find((c) => c.id === cId)?.name)
              .filter(Boolean);

            return (
              <Card key={assessment.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {assessment.subject}
                      </Badge>
                    </div>
                    {isCompleted && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="mb-4">{assessment.description}</CardDescription>

                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      <span>{assessment.questionCount} questions</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Concepts Covered:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {concepts.map((concept) => (
                        <span
                          key={concept}
                          className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button asChild className="w-full" variant={isCompleted ? "outline" : "default"}>
                      <Link href={`/dashboard/assessments/${assessment.id}`}>
                        {isCompleted ? "Retake Assessment" : "Start Assessment"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {assessmentResults.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Completed Assessments</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Assessment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Time
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentResults.map((result) => {
                    const assessment = mockAssessments.find((a) => a.id === result.assessmentId);
                    return (
                      <tr key={result.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">
                          {assessment?.title || result.assessmentId}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{result.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              result.score >= 80
                                ? "bg-success/10 text-success"
                                : result.score >= 60
                                  ? "bg-warning/10 text-warning-foreground"
                                  : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {result.score}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {result.timeTaken} min
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/dashboard/assessments/${result.assessmentId}/results`}>
                              View Results
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
