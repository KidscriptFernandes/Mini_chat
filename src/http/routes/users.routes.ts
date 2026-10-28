import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authGuard } from '../middlewares/auth-guard.js';
import {
  updateUserBodySchema,
  userResponseSchema,
} from '../schemas/user.schema.js';
import {
  makeGetUserProfileUseCase,
  makeListUsersUseCase,
  makeUpdateUserProfileUseCase,
} from '../../use-cases/factories/index.js';

export async function usersRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.get(
    '/me',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            user: userResponseSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const getUserProfileUseCase = makeGetUserProfileUseCase();
      const { user } = await getUserProfileUseCase.execute({
        userId: request.user.sub,
      });

      return reply.status(200).send({ user });
    }
  );

  router.put(
    '/me',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        body: updateUserBodySchema,
        response: {
          200: z.object({
            user: userResponseSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const updateUserProfileUseCase = makeUpdateUserProfileUseCase();
      const { user } = await updateUserProfileUseCase.execute({
        userId: request.user.sub,
        ...request.body,
      });

      return reply.status(200).send({ user });
    }
  );

  router.get(
    '/',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            users: z.array(userResponseSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const listUsersUseCase = makeListUsersUseCase();
      const { users } = await listUsersUseCase.execute();

      return reply.status(200).send({ users });
    }
  );
}
