import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import type { ResumeData } from '../types';

const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

interface ATSResult {
  score: number;
  breakdown: {
    contactInfo: { score: number; issues: string[] };
    experience: { score: number; issues: string[] };
    education: { score: number; issues: string[] };
    skills: { score: number; issues: string[] };
    formatting: { score: number; issues: string[] };
  };
  suggestions: string[];
}

export function ruleBasedATS(data: ResumeData): ATSResult {
  const breakdown = {
    contactInfo: { score: 0, issues: [] as string[] },
    experience: { score: 0, issues: [] as string[] },
    education: { score: 0, issues: [] as string[] },
    skills: { score: 0, issues: [] as string[] },
    formatting: { score: 0, issues: [] as string[] },
  };

  // Contact Info (20 points)
  const pi = data.personalInfo;
  if (pi?.fullName) breakdown.contactInfo.score += 5;
  else breakdown.contactInfo.issues.push('Missing full name');
  if (pi?.email) breakdown.contactInfo.score += 5;
  else breakdown.contactInfo.issues.push('Missing email');
  if (pi?.phone) breakdown.contactInfo.score += 5;
  else breakdown.contactInfo.issues.push('Missing phone number');
  if (pi?.location) breakdown.contactInfo.score += 3;
  else breakdown.contactInfo.issues.push('Missing location');
  if (pi?.linkedin) breakdown.contactInfo.score += 2;

  // Experience (30 points)
  const exp = data.experience || [];
  if (exp.length > 0) {
    breakdown.experience.score += 10;
    const hasDescriptions = exp.every(e => e.description && e.description.length > 20);
    if (hasDescriptions) breakdown.experience.score += 10;
    else breakdown.experience.issues.push('Some experience entries lack detailed descriptions');
    const hasDates = exp.every(e => e.startDate);
    if (hasDates) breakdown.experience.score += 5;
    else breakdown.experience.issues.push('Missing dates in experience entries');
    const hasActionVerbs = exp.some(e => /^(Led|Managed|Developed|Created|Implemented|Designed|Built|Increased|Reduced|Achieved)/m.test(e.description));
    if (hasActionVerbs) breakdown.experience.score += 5;
    else breakdown.experience.issues.push('Use strong action verbs to start bullet points');
  } else {
    breakdown.experience.issues.push('No work experience added');
  }

  // Education (15 points)
  const edu = data.education || [];
  if (edu.length > 0) {
    breakdown.education.score += 10;
    if (edu.every(e => e.degree)) breakdown.education.score += 5;
    else breakdown.education.issues.push('Missing degree information');
  } else {
    breakdown.education.issues.push('No education added');
  }

  // Skills (20 points)
  const skills = data.skills || [];
  if (skills.length >= 5) breakdown.skills.score += 20;
  else if (skills.length >= 3) { breakdown.skills.score += 12; breakdown.skills.issues.push('Add more skills (aim for 8-12)'); }
  else if (skills.length > 0) { breakdown.skills.score += 5; breakdown.skills.issues.push('Too few skills listed'); }
  else breakdown.skills.issues.push('No skills added');

  // Formatting (15 points)
  if (pi?.summary && pi.summary.length >= 50) breakdown.formatting.score += 8;
  else breakdown.formatting.issues.push('Add a professional summary (50+ characters)');
  if (pi?.summary && pi.summary.length <= 500) breakdown.formatting.score += 4;
  else if (pi?.summary) breakdown.formatting.issues.push('Summary is too long');
  if (data.languages && data.languages.length > 0) breakdown.formatting.score += 3;

  const totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
  const allIssues = Object.values(breakdown).flatMap(b => b.issues);

  return {
    score: totalScore,
    breakdown,
    suggestions: allIssues.slice(0, 5),
  };
}

export async function aiEnhancedATS(
  data: ResumeData,
  jobDescription?: string,
  locale: string = 'en'
): Promise<{ suggestions: string[]; tokensUsed: number }> {
  const lang = locale === 'tr' ? 'Turkish' : 'English';
  const jdContext = jobDescription ? `\nTarget job description: "${jobDescription}"` : '';

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Analyze this resume data for ATS optimization and provide 5 specific, actionable suggestions. Write in ${lang}.${jdContext}

Resume data:
${JSON.stringify(data, null, 2)}

Return exactly 5 suggestions, one per line, each starting with "•". Focus on: keyword optimization, formatting, content quality, and ATS compatibility.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const suggestions = text.split('\n').filter(l => l.trim().startsWith('•')).map(l => l.trim().replace(/^•\s*/, ''));
  const tokensUsed = (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0);

  return { suggestions, tokensUsed };
}
