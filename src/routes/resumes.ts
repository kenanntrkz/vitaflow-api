import { FastifyInstance } from 'fastify';
import { query } from '../db';
import { resumeCreateSchema, resumeUpdateSchema } from '../utils/validation';
import type { Resume } from '../types';

export async function resumeRoutes(fastify: FastifyInstance) {
  // All routes require auth
  fastify.addHook('onRequest', fastify.authenticate);

  // GET /resumes
  fastify.get('/resumes', async (request) => {
    const resumes = await query<Resume>(
      'SELECT id, title, template_id, locale, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [request.user!.userId]
    );
    return { resumes };
  });

  // GET /resumes/:id
  fastify.get<{ Params: { id: string } }>('/resumes/:id', async (request, reply) => {
    const [resume] = await query<Resume>(
      'SELECT * FROM resumes WHERE id = $1 AND user_id = $2',
      [request.params.id, request.user!.userId]
    );
    if (!resume) return reply.status(404).send({ error: 'Resume not found' });
    return { resume };
  });

  // POST /resumes
  fastify.post('/resumes', async (request, reply) => {
    const parsed = resumeCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const userId = request.user!.userId;

    // Free users: max 1 resume
    const [user] = await query<{ is_premium: boolean }>('SELECT is_premium FROM users WHERE id = $1', [userId]);
    if (!user.is_premium) {
      const [count] = await query<{ count: string }>('SELECT COUNT(*) as count FROM resumes WHERE user_id = $1', [userId]);
      if (parseInt(count.count) >= 1) {
        return reply.status(403).send({ error: 'Free users can create only 1 resume. Upgrade to premium.' });
      }
    }

    const { title, template_id, data_json, locale } = parsed.data;
    const [resume] = await query<Resume>(
      'INSERT INTO resumes (user_id, title, template_id, data_json, locale) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, template_id || null, JSON.stringify(data_json), locale]
    );
    return reply.status(201).send({ resume });
  });

  // PUT /resumes/:id
  fastify.put<{ Params: { id: string } }>('/resumes/:id', async (request, reply) => {
    const parsed = resumeUpdateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const userId = request.user!.userId;
    const resumeId = request.params.id;

    // Check ownership
    const [existing] = await query<Resume>('SELECT id FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, userId]);
    if (!existing) return reply.status(404).send({ error: 'Resume not found' });

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const data = parsed.data;
    if (data.title !== undefined) { updates.push(`title = $${idx++}`); values.push(data.title); }
    if (data.template_id !== undefined) { updates.push(`template_id = $${idx++}`); values.push(data.template_id); }
    if (data.data_json !== undefined) { updates.push(`data_json = $${idx++}`); values.push(JSON.stringify(data.data_json)); }
    if (data.locale !== undefined) { updates.push(`locale = $${idx++}`); values.push(data.locale); }

    if (updates.length === 0) {
      return reply.status(400).send({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(resumeId, userId);

    const [resume] = await query<Resume>(
      `UPDATE resumes SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
      values
    );
    return { resume };
  });

  // DELETE /resumes/:id
  fastify.delete<{ Params: { id: string } }>('/resumes/:id', async (request, reply) => {
    const [deleted] = await query<Resume>(
      'DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id',
      [request.params.id, request.user!.userId]
    );
    if (!deleted) return reply.status(404).send({ error: 'Resume not found' });
    return { success: true };
  });
}
