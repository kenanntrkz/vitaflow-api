import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

interface GenerateParams {
  section: 'summary' | 'experience' | 'skills';
  context: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    yearsOfExperience?: number;
    existingText?: string;
    skills?: string[];
  };
  locale: string;
}

interface OptimizeParams {
  text: string;
  section: string;
  locale: string;
}

export async function generateContent(params: GenerateParams): Promise<{ text: string; tokensUsed: number }> {
  const { section, context, locale } = params;
  const lang = locale === 'tr' ? 'Turkish' : 'English';

  const prompts: Record<string, string> = {
    summary: `Write a professional resume summary/objective for a ${context.jobTitle || 'professional'}${context.industry ? ` in ${context.industry}` : ''}${context.yearsOfExperience ? ` with ${context.yearsOfExperience} years of experience` : ''}. ${context.skills?.length ? `Key skills: ${context.skills.join(', ')}.` : ''} Write in ${lang}. Be concise (3-4 sentences), impactful, and ATS-friendly. Use action-oriented language. Return only the summary text, no labels or headers.`,

    experience: `Write professional resume bullet points for a ${context.jobTitle || 'professional'} at ${context.company || 'a company'}${context.industry ? ` in ${context.industry}` : ''}. ${context.existingText ? `Current description: "${context.existingText}". Improve it.` : 'Create 3-5 bullet points.'} Write in ${lang}. Start each bullet with a strong action verb. Include quantifiable achievements where possible. Return only the bullet points, one per line starting with "•".`,

    skills: `List 8-12 relevant professional skills for a ${context.jobTitle || 'professional'}${context.industry ? ` in ${context.industry}` : ''}. ${context.skills?.length ? `Already listed: ${context.skills.join(', ')}. Suggest additional complementary skills.` : ''} Write in ${lang}. Return as a comma-separated list. Mix hard and soft skills. Prioritize ATS-relevant keywords.`,
  };

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompts[section] || prompts.summary }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const tokensUsed = (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0);

  return { text, tokensUsed };
}

export async function optimizeContent(params: OptimizeParams): Promise<{ text: string; tokensUsed: number }> {
  const { text, section, locale } = params;
  const lang = locale === 'tr' ? 'Turkish' : 'English';

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Optimize this resume ${section} text for ATS compatibility and impact. Make it more professional, concise, and keyword-rich. Use strong action verbs. Write in ${lang}.

Original text:
"${text}"

Return only the improved text, no explanations.`,
    }],
  });

  const optimized = response.content[0].type === 'text' ? response.content[0].text : '';
  const tokensUsed = (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0);

  return { text: optimized, tokensUsed };
}
