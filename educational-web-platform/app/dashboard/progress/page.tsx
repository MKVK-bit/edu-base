"use client";

import React from "react"

import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell,
} from "recharts";
import { useApp } from "@/lib/app-context";
import { mockConcepts } from "@/lib/data";
import { TrendingUp, TrendingDown, Minus, Target, Award, Calendar } from "lucide-react";

export default function ProgressPage() {
  const { progressHistory, assessmentResults, certificates } = useApp();

  const conceptProgress = mockConcepts
    .map((concept) => {
      const history = progressHistory
        .filter((p) => p.conceptId === concept.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (history.length === 0) return null;

      const latestScore = history[history.length - 1].score;
      const firstScore = history[0].score;
      const improvement = latestScore - firstScore;

      return {
        ...concept,
        history,
        latestScore,
        firstScore,
        improvement,
        trend: improvement > 5 ? "up" : improvement < -5 ? "down" : "stable",
      };
    })
    .filter(Boolean);

  const fractionsData = progressHistory
    .filter((p) => p.conceptId === "c1")
    .map((p) => ({
      date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: p.score,
    }));

  const algebraData = progressHistory
    .filter((p) => p.conceptId === "c3")
    .map((p) => ({
      date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: p.score,
    }));

  const latestResults = assessmentResults[assessmentResults.length - 1];
  const conceptBarData = latestResults?.conceptScores.map((cs) => {
    const concept = mockConcepts.find((c) => c.id === cs.conceptId);
    return {
      name: concept?.name || cs.conceptId,
      score: cs.score,
      status: cs.status,
    };
  }) || [];

  const barColors = {
    weak: "#ef4444",
    moderate: "#f59e0b",
    strong: "#22c55e",
  };

  const overallStats = {
    totalAssessments: assessmentResults.length,
    avgScore: assessmentResults.length
      ? Math.round(assessmentResults.reduce((acc, r) => acc + r.score, 0) / assessmentResults.length)
      : 0,
    certificatesEarned: certificates.length,
    conceptsImproved: conceptProgress.filter((c) => c && c.improvement > 10).length,
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Progress Analytics"
        description="Track your learning journey and improvement over time"
      />

      <div className="p-6">
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Target}
            label="Assessments Completed"
            value={overallStats.totalAssessments}
            description="Total tests taken"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Score"
            value={`${overallStats.avgScore}%`}
            description="Across all assessments"
          />
          <StatCard
            icon={Award}
            label="Certificates Earned"
            value={overallStats.certificatesEarned}
            description="Skills validated"
          />
          <StatCard
            icon={Calendar}
            label="Concepts Improved"
            value={overallStats.conceptsImproved}
            description="Showing growth"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {fractionsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fractions Progress</CardTitle>
                <CardDescription>Your improvement in understanding fractions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fractionsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-score)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {algebraData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Algebra Basics Progress</CardTitle>
                <CardDescription>Your improvement in algebra fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={algebraData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-score)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {conceptBarData.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Latest Assessment Breakdown</CardTitle>
              <CardDescription>Concept scores from your most recent assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conceptBarData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={75} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {conceptBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[entry.status as keyof typeof barColors]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
                  <span className="text-sm text-muted-foreground">Weak (&lt;60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-sm text-muted-foreground">Moderate (60-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
                  <span className="text-sm text-muted-foreground">Strong (80%+)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Concept Progress Summary</CardTitle>
            <CardDescription>Overview of all your concept improvements</CardDescription>
          </CardHeader>
          <CardContent>
            {conceptProgress.length > 0 ? (
              <div className="space-y-6">
                {conceptProgress.map((concept) => {
                  if (!concept) return null;
                  return (
                    <div key={concept.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {concept.trend === "up" ? (
                            <TrendingUp className="h-5 w-5 text-success" />
                          ) : concept.trend === "down" ? (
                            <TrendingDown className="h-5 w-5 text-destructive" />
                          ) : (
                            <Minus className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="font-medium text-foreground">{concept.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {concept.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {concept.firstScore}% → {concept.latestScore}%
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              concept.improvement > 0
                                ? "text-success"
                                : concept.improvement < 0
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {concept.improvement > 0 ? "+" : ""}
                            {concept.improvement}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={concept.latestScore}
                        className={`h-2 ${
                          concept.latestScore >= 80
                            ? "[&>div]:bg-success"
                            : concept.latestScore >= 60
                              ? "[&>div]:bg-warning"
                              : "[&>div]:bg-destructive"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Complete some assessments to start tracking your progress
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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
