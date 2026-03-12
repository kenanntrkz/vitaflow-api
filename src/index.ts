import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { authPlugin } from './plugins/auth';
import { authRoutes } from './routes/auth';
import { resumeRoutes } from './routes/resumes';
import { templateRoutes } from './routes/templates';
import { aiRoutes } from './routes/ai';
import { userRoutes } from './routes/users';
import { webhookRoutes } from './routes/webhooks';

const fastify = Fastify({ logger: true });

async function main() {
  // Plugins
  await fastify.register(cors, { origin: true });
  await fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await fastify.register(authPlugin);

  // Routes
  await fastify.register(authRoutes);
  await fastify.register(resumeRoutes);
  await fastify.register(templateRoutes);
  await fastify.register(aiRoutes);
  await fastify.register(userRoutes);
  await fastify.register(webhookRoutes);

  // Health check
  fastify.get('/health', async () => ({ status: 'ok', version: '1.0.0' }));

  // Privacy policy (static HTML)
  fastify.get('/privacy', async (request, reply) => {
    reply.type('text/html').send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>VitaFlow Privacy Policy</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7}h1{color:#2563EB}h2{color:#334155;margin-top:32px}ul{padding-left:20px}.updated{color:#64748B;font-size:13px}</style></head>
<body><h1>VitaFlow — Privacy Policy</h1><p class="updated">Last updated: March 12, 2026</p>
<h2>1. Information We Collect</h2><p>Account info (email, name, encrypted password), resume data, and usage patterns.</p>
<h2>2. How We Use Your Information</h2><p>To create/manage accounts, store resumes, generate AI content, perform ATS checks, and manage subscriptions.</p>
<h2>3. AI Processing</h2><p>AI features send resume data to Anthropic's Claude AI for content generation. Data is not stored beyond the request.</p>
<h2>4. Data Storage & Security</h2><p>Encrypted at rest and in transit. Passwords hashed with bcrypt.</p>
<h2>5. Data Sharing</h2><p>We don't sell data. Shared only with Anthropic (AI), RevenueCat (subscriptions), Google Play (distribution).</p>
<h2>6. Your Rights</h2><p>Access, export (PDF), delete account, opt out of AI features.</p>
<h2>7. Data Retention</h2><p>Retained while account is active. Deleted within 30 days of account deletion.</p>
<h2>8. Children's Privacy</h2><p>Not intended for users under 13.</p>
<h2>9. Contact</h2><p>privacy@vitaflow.app</p></body></html>`);
  });

  // Start
  await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
  console.log(`VitaFlow API running on port ${config.PORT}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
