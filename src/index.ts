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

  // Start
  await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
  console.log(`VitaFlow API running on port ${config.PORT}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
