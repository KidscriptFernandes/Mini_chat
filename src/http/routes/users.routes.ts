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
        summary: 'Busca o perfil do usuário logado.',
        description: 'Retorna o perfil completo do usuário autenticado.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            user: userResponseSchema,
          }).describe('Perfil do usuário logado.'),
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
        summary: 'Atualiza o perfil do usuário logado.',
        description: 'Atualiza o perfil do usuário logado e retorna o perfil atualizado.',
        security: [{ bearerAuth: [] }],
        body: updateUserBodySchema,
        response: {
          200: z.object({
            user: userResponseSchema,
          }).describe('Perfil atualizado do usuário logado.'),
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
        summary: 'Lista todos os usuários.',
        description: 'Retorna uma lista com todos os usuários do sistema.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            users: z.array(userResponseSchema),
          }).describe('Lista de usuários cadastrados.'),
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
