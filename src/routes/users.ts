import { FastifyInstance } from 'fastify';
import { query } from '../db';
import type { User } from '../types';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // GET /users/me
  fastify.get('/users/me', async (request, reply) => {
    const [user] = await query<User>(
      'SELECT id, email, name, is_premium, premium_expires_at, locale, created_at FROM users WHERE id = $1',
      [request.user!.userId]
    );
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return { user };
  });
}
