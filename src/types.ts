export interface SiteProfile {
  name: string;
  school: string;
  grade: string;
  tagline: string;
  aboutMe: string;
  learningFocus: string;
  currentLearning: string;
  futureGoals: string;
  avatarUrl: string;
  adminEmail: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  challenge: string;
  solution: string;
  reflection: string;
  coverImage?: string;
  videoUrl?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
  order: number;
  createdAt?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  order: number;
  createdAt?: string;
}
