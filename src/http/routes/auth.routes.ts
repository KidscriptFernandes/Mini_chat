import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  authenticateBodySchema,
  registerBodySchema,
  userResponseSchema,
} from '../schemas/user.schema.js';
import {
  makeAuthenticateUserUseCase,
  makeRegisterUserUseCase,
} from '../../use-cases/factories/index.js';

export async function authRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Registra um novo usuário.',
        description: 'Registra um novo usuário no sistema.',
        body: registerBodySchema,
        response: {
          201: z.object({
            user: userResponseSchema,
          }).describe('Usuário registrado com sucesso.'),
        },
      },
    },
    async (request, reply) => {
      const registerUserUseCase = makeRegisterUserUseCase();
      const { user } = await registerUserUseCase.execute(request.body);

      return reply.status(201).send({ user });
    }
  );

  router.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Autentica um usuário.',
        description: 'Fazer login.',
        body: authenticateBodySchema,
        response: {
          200: z.object({
            token: z.string(),
            user: userResponseSchema,
          }).describe('Usuário autenticado com sucesso.'),
        },
      },
    },
    async (request, reply) => {
      const authenticateUserUseCase = makeAuthenticateUserUseCase();
      const { user } = await authenticateUserUseCase.execute(request.body);

      const token = await reply.jwtSign(
        { sub: user.id },
        { expiresIn: '7d' }
      );

      return reply.status(200).send({
        token,
        user,
      });
    }
  );
}
