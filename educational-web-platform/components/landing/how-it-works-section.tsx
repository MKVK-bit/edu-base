const steps = [
  {
    number: "01",
    title: "Take a Diagnostic Assessment",
    description: "Complete a short, concept-based test in your subject area. Our assessments focus on understanding, not memorization.",
  },
  {
    number: "02",
    title: "Review Your Gap Analysis",
    description: "See clearly which concepts you've mastered and which need work. No more guessing where to focus.",
  },
  {
    number: "03",
    title: "Get Personalized Recommendations",
    description: "Receive targeted learning resources, practice tasks, and suggested mentors based on your specific needs.",
  },
  {
    number: "04",
    title: "Learn with Expert Mentors",
    description: "Book sessions with specialists in your weak areas. Get feedback and guidance from experienced educators.",
  },
  {
    number: "05",
    title: "Track Progress and Earn Certificates",
    description: "Monitor your improvement over time. Once you demonstrate mastery, earn certificates validated by mentor feedback.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How EduBase Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A proven approach to identifying and overcoming learning gaps.
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute left-[27px] top-0 hidden h-full w-0.5 bg-border md:block" />
            
            <div className="space-y-8 md:space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="relative flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <span className="text-lg font-bold">{step.number}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                    
                    {index < steps.length - 1 && (
                      <div className="mt-4 h-0.5 w-16 bg-border md:hidden" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
