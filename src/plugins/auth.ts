import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyAccessToken } from '../utils/jwt';

export const authPlugin = fp(async function (fastify: FastifyInstance) {
  fastify.decorateRequest('user', undefined);

  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.slice(7);
    try {
      const payload = verifyAccessToken(token);
      request.user = payload;
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
