"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, AssessmentResult, Booking, ProgressRecord, Certificate } from "./data";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  assessmentResults: AssessmentResult[];
  bookings: Booking[];
  progressHistory: ProgressRecord[];
  certificates: Certificate[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addAssessmentResult: (result: AssessmentResult) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  addProgressRecord: (record: ProgressRecord) => void;
  addCertificate: (certificate: Certificate) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUser: User = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "student",
  grade: "8th Grade",
  subjects: ["Mathematics", "Science", "English"],
};

const mockResults: AssessmentResult[] = [
  {
    id: "r1",
    assessmentId: "a1",
    userId: "u1",
    date: "2026-01-15",
    score: 65,
    conceptScores: [
      { conceptId: "c1", score: 45, status: "weak" },
      { conceptId: "c2", score: 70, status: "moderate" },
      { conceptId: "c3", score: 85, status: "strong" },
      { conceptId: "c4", score: 60, status: "moderate" },
    ],
    timeTaken: 18,
  },
  {
    id: "r2",
    assessmentId: "a2",
    userId: "u1",
    date: "2026-01-20",
    score: 78,
    conceptScores: [
      { conceptId: "c5", score: 72, status: "moderate" },
      { conceptId: "c6", score: 84, status: "strong" },
    ],
    timeTaken: 12,
  },
];

const mockBookings: Booking[] = [
  {
    id: "b1",
    studentId: "u1",
    mentorId: "m1",
    date: "2026-02-05",
    time: "2:00 PM",
    subject: "Mathematics",
    concept: "Fractions",
    status: "upcoming",
  },
];

const mockProgress: ProgressRecord[] = [
  { date: "2026-01-01", conceptId: "c1", score: 30 },
  { date: "2026-01-08", conceptId: "c1", score: 38 },
  { date: "2026-01-15", conceptId: "c1", score: 45 },
  { date: "2026-01-22", conceptId: "c1", score: 55 },
  { date: "2026-01-29", conceptId: "c1", score: 62 },
  { date: "2026-01-01", conceptId: "c3", score: 60 },
  { date: "2026-01-08", conceptId: "c3", score: 70 },
  { date: "2026-01-15", conceptId: "c3", score: 85 },
];

const mockCertificates: Certificate[] = [
  {
    id: "cert1",
    studentId: "u1",
    studentName: "Alex Johnson",
    skill: "Algebra Basics",
    subject: "Mathematics",
    issuedDate: "2026-01-20",
    mentorId: "m1",
    mentorName: "Dr. Sarah Chen",
    mentorFeedback: "Alex demonstrated excellent problem-solving skills and a solid understanding of algebraic concepts. Their ability to apply variables in real-world scenarios shows true mastery.",
    improvementPercentage: 42,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    assessmentResults: [],
    bookings: [],
    progressHistory: [],
    certificates: [],
  });

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (email) {
      setState({
        user: mockUser,
        isAuthenticated: true,
        assessmentResults: mockResults,
        bookings: mockBookings,
        progressHistory: mockProgress,
        certificates: mockCertificates,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      assessmentResults: [],
      bookings: [],
      progressHistory: [],
      certificates: [],
    });
  }, []);

  const addAssessmentResult = useCallback((result: AssessmentResult) => {
    setState((prev) => ({
      ...prev,
      assessmentResults: [...prev.assessmentResults, result],
    }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setState((prev) => ({
      ...prev,
      bookings: [...prev.bookings, booking],
    }));
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const addProgressRecord = useCallback((record: ProgressRecord) => {
    setState((prev) => ({
      ...prev,
      progressHistory: [...prev.progressHistory, record],
    }));
  }, []);

  const addCertificate = useCallback((certificate: Certificate) => {
    setState((prev) => ({
      ...prev,
      certificates: [...prev.certificates, certificate],
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addAssessmentResult,
        addBooking,
        updateBooking,
        addProgressRecord,
        addCertificate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
