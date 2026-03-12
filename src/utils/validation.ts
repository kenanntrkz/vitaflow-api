import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(255),
  locale: z.enum(['en', 'tr']).default('en'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const resumeCreateSchema = z.object({
  title: z.string().min(1).max(255).default('Untitled Resume'),
  template_id: z.number().int().positive().optional(),
  data_json: z.record(z.any()).default({}),
  locale: z.enum(['en', 'tr']).default('en'),
});

export const resumeUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  template_id: z.number().int().positive().nullable().optional(),
  data_json: z.record(z.any()).optional(),
  locale: z.enum(['en', 'tr']).optional(),
});

export const aiGenerateSchema = z.object({
  section: z.enum(['summary', 'experience', 'skills']),
  context: z.object({
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    existingText: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }),
  locale: z.enum(['en', 'tr']).default('en'),
});

export const aiOptimizeSchema = z.object({
  text: z.string().min(1).max(5000),
  section: z.enum(['summary', 'experience', 'skills']),
  locale: z.enum(['en', 'tr']).default('en'),
});

export const atsCheckSchema = z.object({
  resumeData: z.record(z.any()),
  jobDescription: z.string().optional(),
  locale: z.enum(['en', 'tr']).default('en'),
});
