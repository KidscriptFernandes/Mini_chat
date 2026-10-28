import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authRoutes } from './auth.routes.js';
import { usersRoutes } from './users.routes.js';
import { messagesRoutes } from './messages.routes.js';

export async function appRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health',
    {
      schema: {
        tags: ['System'],
        response: {
          200: z.object({
            status: z.literal('ok'),
            timestamp: z.string(),
            uptime: z.number(),
          }),
        },
      },
    },
    async () => {
      return {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }
  );

  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(usersRoutes, { prefix: '/users' });
  await app.register(messagesRoutes, { prefix: '/messages' });
}
