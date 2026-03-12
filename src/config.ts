import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3500),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ANTHROPIC_API_KEY: z.string(),
  REVENUECAT_WEBHOOK_SECRET: z.string().default(''),
});

export const config = envSchema.parse(process.env);
