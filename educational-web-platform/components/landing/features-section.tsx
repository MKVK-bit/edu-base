import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Users, BarChart3, Award, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Diagnostic Assessments",
    description: "Short, concept-based tests that identify exactly where understanding breaks down, not just what scores look like.",
  },
  {
    icon: Target,
    title: "Gap Analysis",
    description: "Clear visualization of strong and weak concepts, helping students focus their efforts where it matters most.",
  },
  {
    icon: Lightbulb,
    title: "Personalized Learning",
    description: "Targeted resources and practice tasks tailored to each student's identified learning gaps.",
  },
  {
    icon: Users,
    title: "Expert Mentors",
    description: "Book sessions with specialized mentors who provide feedback and practical support in weak areas.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visual tracking of improvement over time, showing real growth in understanding, not just scores.",
  },
  {
    icon: Award,
    title: "Skill Certificates",
    description: "Earn certificates validated by mentor feedback that prove true mastery, not just exam completion.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Everything Students Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete learning ecosystem designed to identify gaps early and build true understanding.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
