export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "mentor";
  grade?: string;
  subjects?: string[];
  expertise?: string[];
  bio?: string;
  rating?: number;
  sessionsCompleted?: number;
}

export interface Concept {
  id: string;
  name: string;
  subject: string;
  description: string;
  difficulty: "foundational" | "intermediate" | "advanced";
}

export interface Question {
  id: string;
  conceptId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  questionCount: number;
  concepts: string[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  date: string;
  score: number;
  conceptScores: { conceptId: string; score: number; status: "weak" | "moderate" | "strong" }[];
  timeTaken: number;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  bio: string;
  rating: number;
  sessionsCompleted: number;
  hourlyRate: number;
  availability: { day: string; slots: string[] }[];
}

export interface Booking {
  id: string;
  studentId: string;
  mentorId: string;
  date: string;
  time: string;
  subject: string;
  concept: string;
  status: "upcoming" | "completed" | "cancelled";
  feedback?: string;
}

export interface ProgressRecord {
  date: string;
  conceptId: string;
  score: number;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  skill: string;
  subject: string;
  issuedDate: string;
  mentorId: string;
  mentorName: string;
  mentorFeedback: string;
  improvementPercentage: number;
}

export const mockConcepts: Concept[] = [
  { id: "c1", name: "Fractions", subject: "Mathematics", description: "Understanding parts of a whole", difficulty: "foundational" },
  { id: "c2", name: "Decimals", subject: "Mathematics", description: "Working with decimal numbers", difficulty: "foundational" },
  { id: "c3", name: "Algebra Basics", subject: "Mathematics", description: "Introduction to variables and equations", difficulty: "intermediate" },
  { id: "c4", name: "Geometry", subject: "Mathematics", description: "Shapes, angles, and spatial reasoning", difficulty: "intermediate" },
  { id: "c5", name: "Grammar Fundamentals", subject: "English", description: "Parts of speech and sentence structure", difficulty: "foundational" },
  { id: "c6", name: "Reading Comprehension", subject: "English", description: "Understanding and analyzing text", difficulty: "intermediate" },
  { id: "c7", name: "Scientific Method", subject: "Science", description: "Hypothesis, experimentation, and analysis", difficulty: "foundational" },
  { id: "c8", name: "Forces and Motion", subject: "Science", description: "Newton's laws and physics basics", difficulty: "intermediate" },
];

export const mockQuestions: Question[] = [
  { id: "q1", conceptId: "c1", text: "What is 1/2 + 1/4?", options: ["1/4", "3/4", "2/6", "1/6"], correctAnswer: 1, explanation: "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4" },
  { id: "q2", conceptId: "c1", text: "Simplify 4/8", options: ["1/2", "2/4", "1/4", "4/8"], correctAnswer: 0, explanation: "Divide both numerator and denominator by 4 to get 1/2" },
  { id: "q3", conceptId: "c2", text: "Convert 0.75 to a fraction", options: ["3/4", "7/5", "75/10", "1/75"], correctAnswer: 0, explanation: "0.75 = 75/100 = 3/4 when simplified" },
  { id: "q4", conceptId: "c3", text: "Solve for x: 2x + 5 = 13", options: ["x = 4", "x = 9", "x = 6", "x = 8"], correctAnswer: 0, explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4" },
  { id: "q5", conceptId: "c4", text: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: 1, explanation: "The sum of interior angles in any triangle is always 180°" },
  { id: "q6", conceptId: "c5", text: "Which word is a verb?", options: ["Quickly", "Running", "Beautiful", "Happiness"], correctAnswer: 1, explanation: "Running is an action word (verb). Quickly is an adverb, beautiful is an adjective, happiness is a noun." },
  { id: "q7", conceptId: "c7", text: "What comes first in the scientific method?", options: ["Experiment", "Hypothesis", "Observation", "Conclusion"], correctAnswer: 2, explanation: "The scientific method begins with observation, which leads to questions and then hypothesis formation." },
  { id: "q8", conceptId: "c8", text: "What is Newton's First Law about?", options: ["Force equals mass times acceleration", "Inertia", "Action and reaction", "Gravity"], correctAnswer: 1, explanation: "Newton's First Law is the law of inertia - objects at rest stay at rest, objects in motion stay in motion unless acted upon by a force." },
];

export const mockAssessments: Assessment[] = [
  { id: "a1", title: "Math Foundations", subject: "Mathematics", description: "Assess your understanding of basic math concepts", duration: 20, questionCount: 10, concepts: ["c1", "c2", "c3", "c4"] },
  { id: "a2", title: "English Essentials", subject: "English", description: "Test your grammar and comprehension skills", duration: 15, questionCount: 8, concepts: ["c5", "c6"] },
  { id: "a3", title: "Science Basics", subject: "Science", description: "Evaluate your scientific reasoning", duration: 15, questionCount: 8, concepts: ["c7", "c8"] },
];

export const mockMentors: Mentor[] = [
  {
    id: "m1",
    name: "Dr. Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    expertise: ["Mathematics", "Algebra", "Geometry", "Fractions"],
    bio: "PhD in Mathematics Education with 10+ years of experience helping students build strong foundations.",
    rating: 4.9,
    sessionsCompleted: 342,
    hourlyRate: 45,
    availability: [
      { day: "Monday", slots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "11:00 AM", "1:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
    ],
  },
  {
    id: "m2",
    name: "Prof. James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    expertise: ["Science", "Physics", "Scientific Method", "Forces and Motion"],
    bio: "Former high school science teacher passionate about making physics accessible and fun.",
    rating: 4.8,
    sessionsCompleted: 256,
    hourlyRate: 40,
    availability: [
      { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "1:00 PM", "2:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "11:00 AM"] },
    ],
  },
  {
    id: "m3",
    name: "Ms. Emily Parker",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    expertise: ["English", "Grammar", "Reading Comprehension", "Writing"],
    bio: "English literature graduate with a talent for breaking down complex grammar concepts.",
    rating: 4.9,
    sessionsCompleted: 189,
    hourlyRate: 35,
    availability: [
      { day: "Monday", slots: ["1:00 PM", "2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "3:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "11:00 AM", "1:00 PM"] },
    ],
  },
];

export const mockLearningResources = [
  { conceptId: "c1", title: "Fractions Made Easy", type: "video", duration: "12 min", url: "#" },
  { conceptId: "c1", title: "Practice: Adding Fractions", type: "exercise", questions: 10, url: "#" },
  { conceptId: "c2", title: "Decimals and Place Value", type: "article", readTime: "8 min", url: "#" },
  { conceptId: "c3", title: "Introduction to Variables", type: "video", duration: "15 min", url: "#" },
  { conceptId: "c4", title: "Geometry Basics Interactive", type: "interactive", url: "#" },
  { conceptId: "c5", title: "Grammar Fundamentals Quiz", type: "exercise", questions: 15, url: "#" },
  { conceptId: "c7", title: "The Scientific Method Explained", type: "video", duration: "10 min", url: "#" },
  { conceptId: "c8", title: "Newton's Laws Simulation", type: "interactive", url: "#" },
];
