export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  html_css: string;
  is_premium: boolean;
  sort_order: number;
  created_at: string;
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  template_id: number | null;
  data_json: ResumeData;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  experience?: {
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }[];
  skills?: string[];
  languages?: {
    name: string;
    level: string;
  }[];
  certifications?: {
    name: string;
    issuer?: string;
    date?: string;
  }[];
}

export interface AIUsage {
  id: number;
  user_id: number;
  action: string;
  tokens_used: number;
  created_at: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
