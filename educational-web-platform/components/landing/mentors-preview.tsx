import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { mockMentors } from "@/lib/data";

export function MentorsPreview() {
  return (
    <section id="mentors" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Learn from Expert Mentors
          </h2>
          <p className="text-lg text-muted-foreground">
            Our mentors specialize in specific concepts and are ready to help you overcome your learning gaps.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockMentors.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={mentor.avatar || "/placeholder.svg"}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm font-medium text-foreground">{mentor.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({mentor.sessionsCompleted} sessions)
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                  {mentor.bio}
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/login">Browse All Mentors</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
