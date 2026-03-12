import { FastifyInstance } from 'fastify';
import { query } from '../db';
import { hashPassword, comparePassword } from '../utils/password';
import {
  signAccessToken, signRefreshToken, verifyRefreshToken,
  storeRefreshToken, revokeRefreshToken, isRefreshTokenValid
} from '../utils/jwt';
import { registerSchema, loginSchema, refreshSchema } from '../utils/validation';
import type { User } from '../types';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/register
  fastify.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const { email, password, name, locale } = parsed.data;

    // Check existing
    const existing = await query<User>('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      return reply.status(409).send({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const [user] = await query<User>(
      'INSERT INTO users (email, password_hash, name, locale) VALUES ($1, $2, $3, $4) RETURNING id, email, name, is_premium, locale, created_at',
      [email, passwordHash, name, locale]
    );

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });
    await storeRefreshToken(user.id, refreshToken);

    return reply.status(201).send({
      user: { id: user.id, email: user.email, name: user.name, is_premium: user.is_premium, locale: user.locale },
      accessToken,
      refreshToken,
    });
  });

  // POST /auth/login
  fastify.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const [user] = await query<User>(
      'SELECT id, email, password_hash, name, is_premium, locale FROM users WHERE email = $1',
      [email]
    );

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });
    await storeRefreshToken(user.id, refreshToken);

    return reply.send({
      user: { id: user.id, email: user.email, name: user.name, is_premium: user.is_premium, locale: user.locale },
      accessToken,
      refreshToken,
    });
  });

  // POST /auth/refresh
  fastify.post('/auth/refresh', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed' });
    }

    const { refreshToken } = parsed.data;

    try {
      const payload = verifyRefreshToken(refreshToken);
      const valid = await isRefreshTokenValid(refreshToken);
      if (!valid) {
        return reply.status(401).send({ error: 'Refresh token revoked' });
      }

      // Rotate: revoke old, issue new
      await revokeRefreshToken(refreshToken);
      const newAccessToken = signAccessToken({ userId: payload.userId, email: payload.email });
      const newRefreshToken = signRefreshToken({ userId: payload.userId, email: payload.email });
      await storeRefreshToken(payload.userId, newRefreshToken);

      return reply.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired refresh token' });
    }
  });
}
