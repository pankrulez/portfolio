
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  moreTags?: string[];
  link?: string;
  github?: string;
  category: 'Data Science' | 'Mobile' | 'Web' | 'Other';
  keyFeatures?: string[];
  technicalChallenges?: string;
  outcome?: string;
}

export interface Skill {
  name: string;
  category: 'Languages' | 'Frameworks' | 'AI & Systems' | 'DevOps';
  level: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  longDescription?: string;
  achievements?: string[];
  skills?: string[];
  isBreak?: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
