"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/app-context";
import { mockAssessments, mockQuestions, mockConcepts } from "@/lib/data";
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TakeAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addAssessmentResult, user } = useApp();

  const assessment = mockAssessments.find((a) => a.id === id);
  const questions = mockQuestions.filter((q) =>
    assessment?.concepts.includes(q.conceptId)
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [timeRemaining, setTimeRemaining] = useState((assessment?.duration || 20) * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (isCompleted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, timeRemaining]);

  if (!assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Assessment not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/assessments">Back to Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const conceptScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      if (!conceptScores[q.conceptId]) {
        conceptScores[q.conceptId] = { correct: 0, total: 0 };
      }
      conceptScores[q.conceptId].total++;
      if (answers[idx] === q.correctAnswer) {
        conceptScores[q.conceptId].correct++;
      }
    });

    const conceptScoreResults = Object.entries(conceptScores).map(([conceptId, data]) => {
      const score = Math.round((data.correct / data.total) * 100);
      return {
        conceptId,
        score,
        status: (score < 60 ? "weak" : score < 80 ? "moderate" : "strong") as
          | "weak"
          | "moderate"
          | "strong",
      };
    });

    const overallScore = Math.round(
      conceptScoreResults.reduce((acc, c) => acc + c.score, 0) / conceptScoreResults.length
    );

    const result = {
      id: `r${Date.now()}`,
      assessmentId: id,
      userId: user?.id || "u1",
      date: new Date().toISOString().split("T")[0],
      score: overallScore,
      conceptScores: conceptScoreResults,
      timeTaken: Math.round(((assessment?.duration || 20) * 60 - timeRemaining) / 60),
    };

    addAssessmentResult(result);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Assessment Complete!</h2>
            <p className="mb-6 text-muted-foreground">
              Your results have been analyzed and personalized recommendations are ready.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href={`/dashboard/assessments/${id}/results`}>View Detailed Results</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/assessments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit
              </Link>
            </Button>
            <h1 className="font-semibold text-foreground">{assessment.title}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span
              className={`font-mono text-sm font-medium ${
                timeRemaining < 60 ? "text-destructive" : "text-foreground"
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-muted-foreground">
              {mockConcepts.find((c) => c.id === question?.conceptId)?.name}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {question && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion] === idx;
                  const isCorrect = idx === question.correctAnswer;
                  const showResult = showExplanation && answers[currentQuestion] !== null;

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => !showExplanation && handleAnswer(idx)}
                      disabled={showExplanation}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        showResult
                          ? isCorrect
                            ? "border-success bg-success/10 text-foreground"
                            : isSelected
                              ? "border-destructive bg-destructive/10 text-foreground"
                              : "border-border bg-background text-muted-foreground"
                          : isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            showResult
                              ? isCorrect
                                ? "bg-success text-success-foreground"
                                : isSelected
                                  ? "bg-destructive text-destructive-foreground"
                                  : "bg-muted text-muted-foreground"
                              : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 rounded-lg bg-muted/50 p-4">
                  <p className="mb-1 text-sm font-medium text-foreground">Explanation:</p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={answers.includes(null)}>
                    Submit Assessment
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {questions.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                setShowExplanation(answers[idx] !== null);
                setCurrentQuestion(idx);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                idx === currentQuestion
                  ? "bg-primary text-primary-foreground"
                  : answers[idx] !== null
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
