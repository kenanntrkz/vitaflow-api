import { FastifyInstance } from 'fastify';
import { config } from '../config';
import { query } from '../db';

export async function webhookRoutes(fastify: FastifyInstance) {
  // POST /webhooks/revenuecat
  fastify.post('/webhooks/revenuecat', async (request, reply) => {
    // Verify webhook auth
    const authHeader = request.headers.authorization;
    if (config.REVENUECAT_WEBHOOK_SECRET && authHeader !== `Bearer ${config.REVENUECAT_WEBHOOK_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as any;
    const event = body?.event;
    if (!event) return reply.status(400).send({ error: 'Missing event' });

    const appUserId = event.app_user_id;
    const eventType = event.type;

    if (!appUserId) return reply.status(400).send({ error: 'Missing app_user_id' });

    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE': {
        const expiresAt = event.expiration_at_ms
          ? new Date(event.expiration_at_ms)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await query(
          'UPDATE users SET is_premium = TRUE, premium_expires_at = $1, updated_at = NOW() WHERE id = $2',
          [expiresAt, appUserId]
        );
        break;
      }
      case 'CANCELLATION':
      case 'EXPIRATION': {
        await query(
          'UPDATE users SET is_premium = FALSE, premium_expires_at = NULL, updated_at = NOW() WHERE id = $1',
          [appUserId]
        );
        break;
      }
    }

    return { success: true };
  });
}
