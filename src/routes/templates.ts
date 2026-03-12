import { FastifyInstance } from 'fastify';
import { query } from '../db';
import type { Template } from '../types';

export async function templateRoutes(fastify: FastifyInstance) {
  // GET /templates — public, no auth required
  fastify.get('/templates', async () => {
    const templates = await query<Template>(
      'SELECT id, name, slug, description, thumbnail_url, is_premium, sort_order FROM templates ORDER BY sort_order ASC'
    );
    return { templates };
  });

  // GET /templates/:id — get full template with html_css
  fastify.get<{ Params: { id: string } }>('/templates/:id', async (request, reply) => {
    const [template] = await query<Template>(
      'SELECT * FROM templates WHERE id = $1',
      [request.params.id]
    );
    if (!template) return reply.status(404).send({ error: 'Template not found' });
    return { template };
  });
}
