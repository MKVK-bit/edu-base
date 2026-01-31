"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { mockMentors, mockConcepts, type Mentor } from "@/lib/data";
import { Star, Search, Calendar, Clock, DollarSign, CheckCircle2 } from "lucide-react";

export default function MentorsPage() {
  const { addBooking, user, assessmentResults, bookings } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedConcept, setSelectedConcept] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const weakConcepts = assessmentResults
    .flatMap((r) => r.conceptScores)
    .filter((c) => c.status === "weak")
    .map((c) => mockConcepts.find((mc) => mc.id === c.conceptId))
    .filter(Boolean);

  const subjects = Array.from(new Set(mockMentors.flatMap((m) => m.expertise)));

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject =
      subjectFilter === "all" ||
      mentor.expertise.some((e) => e.toLowerCase().includes(subjectFilter.toLowerCase()));
    return matchesSearch && matchesSubject;
  });

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");

  const handleBookSession = () => {
    if (!selectedMentor || !selectedDay || !selectedSlot || !user) return;

    const newBooking = {
      id: `b${Date.now()}`,
      studentId: user.id,
      mentorId: selectedMentor.id,
      date: getNextDateForDay(selectedDay),
      time: selectedSlot,
      subject: selectedMentor.expertise[0],
      concept: selectedConcept || selectedMentor.expertise[0],
      status: "upcoming" as const,
    };

    addBooking(newBooking);
    setBookingConfirmed(true);
  };

  const getNextDateForDay = (dayName: string) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dayIndex = days.indexOf(dayName);
    const todayIndex = today.getDay();
    let daysUntil = dayIndex - todayIndex;
    if (daysUntil <= 0) daysUntil += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate.toISOString().split("T")[0];
  };

  const closeDialog = () => {
    setSelectedMentor(null);
    setSelectedDay("");
    setSelectedSlot("");
    setSelectedConcept("");
    setBookingConfirmed(false);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Find a Mentor"
        description="Connect with experts who specialize in your areas of need"
      />

      <div className="p-6">
        {upcomingBookings.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Upcoming Sessions</CardTitle>
              <CardDescription>Scheduled mentor sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map((booking) => {
                  const mentor = mockMentors.find((m) => m.id === booking.mentorId);
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={mentor?.avatar || ""}
                          alt={mentor?.name || "Mentor"}
                          fill
                          className="object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{mentor?.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.concept}</p>
                        <p className="text-sm text-primary">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search mentors by name or expertise..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.slice(0, 8).map((subject) => (
                <SelectItem key={subject} value={subject.toLowerCase()}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {weakConcepts.length > 0 && (
          <div className="mb-6 rounded-lg bg-primary/5 border border-primary/20 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Based on your assessment results, we recommend focusing on:
            </p>
            <div className="flex flex-wrap gap-2">
              {weakConcepts.map((concept) => (
                <Badge key={concept?.id} variant="secondary">
                  {concept?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <CardContent className="flex-1 p-6">
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

                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {mentor.expertise.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${mentor.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{mentor.availability.length} days/week</span>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => setSelectedMentor(mentor)}
                >
                  Book Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedMentor && !bookingConfirmed} onOpenChange={() => closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Book a Session with {selectedMentor?.name}</DialogTitle>
              <DialogDescription>
                Select a day, time slot, and topic for your session
              </DialogDescription>
            </DialogHeader>

            {selectedMentor && (
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Select Day</label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMentor.availability.map((a) => (
                        <SelectItem key={a.day} value={a.day}>
                          {a.day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDay && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Select Time</label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {selectedMentor.availability
                        .find((a) => a.day === selectedDay)
                        ?.slots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {slot}
                          </Button>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground">Topic / Concept</label>
                  <Select value={selectedConcept} onValueChange={setSelectedConcept}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="What do you need help with?" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMentor.expertise.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Session Rate</span>
                    <span className="font-semibold text-foreground">
                      ${selectedMentor.hourlyRate}/hour
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={!selectedDay || !selectedSlot}
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={bookingConfirmed} onOpenChange={() => closeDialog()}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <DialogTitle className="mb-2">Session Booked!</DialogTitle>
              <DialogDescription>
                Your session with {selectedMentor?.name} has been scheduled for {selectedDay} at{" "}
                {selectedSlot}.
              </DialogDescription>
              <Button className="mt-6" onClick={closeDialog}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
