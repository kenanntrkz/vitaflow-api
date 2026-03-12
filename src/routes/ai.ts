import { FastifyInstance } from 'fastify';
import { query } from '../db';
import { generateContent, optimizeContent } from '../services/claude';
import { ruleBasedATS, aiEnhancedATS } from '../services/ats';
import { aiGenerateSchema, aiOptimizeSchema, atsCheckSchema } from '../utils/validation';
import type { ResumeData } from '../types';

const FREE_DAILY_LIMIT = 5;

async function checkAILimit(userId: number, isPremium: boolean): Promise<boolean> {
  if (isPremium) return true;

  const [usage] = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM ai_usage WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 day'`,
    [userId]
  );
  return parseInt(usage.count) < FREE_DAILY_LIMIT;
}

async function recordUsage(userId: number, action: string, tokensUsed: number) {
  await query(
    'INSERT INTO ai_usage (user_id, action, tokens_used) VALUES ($1, $2, $3)',
    [userId, action, tokensUsed]
  );
}

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // POST /ai/generate
  fastify.post('/ai/generate', async (request, reply) => {
    const parsed = aiGenerateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const userId = request.user!.userId;
    const [user] = await query<{ is_premium: boolean }>('SELECT is_premium FROM users WHERE id = $1', [userId]);
    const allowed = await checkAILimit(userId, user.is_premium);
    if (!allowed) {
      return reply.status(429).send({ error: 'Daily AI limit reached. Upgrade to premium for unlimited usage.' });
    }

    const { text, tokensUsed } = await generateContent(parsed.data);
    await recordUsage(userId, 'generate', tokensUsed);

    return { text, tokensUsed };
  });

  // POST /ai/optimize
  fastify.post('/ai/optimize', async (request, reply) => {
    const parsed = aiOptimizeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const userId = request.user!.userId;
    const [user] = await query<{ is_premium: boolean }>('SELECT is_premium FROM users WHERE id = $1', [userId]);
    const allowed = await checkAILimit(userId, user.is_premium);
    if (!allowed) {
      return reply.status(429).send({ error: 'Daily AI limit reached. Upgrade to premium for unlimited usage.' });
    }

    const { text, tokensUsed } = await optimizeContent(parsed.data);
    await recordUsage(userId, 'optimize', tokensUsed);

    return { text, tokensUsed };
  });

  // POST /ai/ats-check
  fastify.post('/ai/ats-check', async (request, reply) => {
    const parsed = atsCheckSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const userId = request.user!.userId;
    const [user] = await query<{ is_premium: boolean }>('SELECT is_premium FROM users WHERE id = $1', [userId]);

    const resumeData = parsed.data.resumeData as ResumeData;
    const ruleResult = ruleBasedATS(resumeData);

    // Free: only rule-based score + top 3 suggestions
    if (!user.is_premium) {
      return {
        score: ruleResult.score,
        suggestions: ruleResult.suggestions.slice(0, 3),
        isPremiumResult: false,
      };
    }

    // Premium: rule-based + AI-enhanced with full breakdown
    const allowed = await checkAILimit(userId, true);
    if (!allowed) {
      return { score: ruleResult.score, breakdown: ruleResult.breakdown, suggestions: ruleResult.suggestions, isPremiumResult: true };
    }

    const { suggestions: aiSuggestions, tokensUsed } = await aiEnhancedATS(
      resumeData, parsed.data.jobDescription, parsed.data.locale
    );
    await recordUsage(userId, 'ats-check', tokensUsed);

    return {
      score: ruleResult.score,
      breakdown: ruleResult.breakdown,
      suggestions: [...ruleResult.suggestions, ...aiSuggestions],
      isPremiumResult: true,
    };
  });
}
