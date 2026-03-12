import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import { query } from '../db';
import type { JWTPayload } from '../types';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function storeRefreshToken(userId: number, token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenHash, expiresAt]
  );
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
}

export async function isRefreshTokenValid(token: string): Promise<boolean> {
  const tokenHash = hashToken(token);
  const rows = await query(
    'SELECT id FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()',
    [tokenHash]
  );
  return rows.length > 0;
}
