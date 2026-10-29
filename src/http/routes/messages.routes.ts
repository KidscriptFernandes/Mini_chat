import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authGuard } from '../middlewares/auth-guard.js';
import {
  getMessagesParamsSchema,
  getMessagesQuerySchema,
  messageResponseSchema,
  sendMessageBodySchema,
} from '../schemas/message.schema.js';
import {
  makeGetChatHistoryUseCase,
  makeSendMessageUseCase,
} from '../../use-cases/factories/index.js';

export async function messagesRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.post(
    '/',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Messages'],
        summary: 'Envia uma mensagem.',
        description: 'Envia uma mensagem para outro usuário.',
        security: [{ bearerAuth: [] }],
        body: sendMessageBodySchema,
        response: {
          201: z.object({
            message: messageResponseSchema,
          }).describe('Mensagem enviada com sucesso.'),
        },
      },
    },
    async (request, reply) => {
      const sendMessageUseCase = makeSendMessageUseCase();
      const { message } = await sendMessageUseCase.execute({
        senderId: request.user.sub,
        receiverId: request.body.receiverId ?? null,
        content: request.body.content,
      });

      return reply.status(201).send({ message });
    }
  );

  router.get(
    '/',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Messages'],
        summary: 'Lista as mensagens do chat.',
        description: 'Lista as mensagens do chat entre dois usuários.',
        security: [{ bearerAuth: [] }],
        querystring: getMessagesQuerySchema,
        response: {
          200: z.object({
            messages: z.array(messageResponseSchema),
          }).describe('Lista de mensagens do chat.'),
        },
      },
    },
    async (request, reply) => {
      const getChatHistoryUseCase = makeGetChatHistoryUseCase();
      const { messages } = await getChatHistoryUseCase.execute({
        currentUserId: request.user.sub,
        otherUserId: request.query.otherUserId,
      });

      return reply.status(200).send({ messages });
    }
  );

  router.get(
    '/:otherUserId',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Messages'],
        summary: 'Busca o histórico de mensagens.',
        description: 'Busca o histórico de mensagens entre o usuário autenticado e outro usuário.',
        security: [{ bearerAuth: [] }],
        params: getMessagesParamsSchema,
        response: {
          200: z.object({
            messages: z.array(messageResponseSchema),
          }).describe('Lista de mensagens do chat.'),
        },
      },
    },
    async (request, reply) => {
      const getChatHistoryUseCase = makeGetChatHistoryUseCase();
      const { messages } = await getChatHistoryUseCase.execute({
        currentUserId: request.user.sub,
        otherUserId: request.params.otherUserId,
      });

      return reply.status(200).send({ messages });
    }
  );
}
