import { z } from 'zod';

export const messageResponseSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string().nullable().optional(),
  content: z.string(),
  createdAt: z.string(),
});

export const sendMessageBodySchema = z.object({
  receiverId: z.string().uuid().nullable().optional(),
  content: z.string().min(1, 'Conteúdo da mensagem não pode ser vazio').max(5000, 'Mensagem muito longa'),
});

export const getMessagesQuerySchema = z.object({
  otherUserId: z.string().uuid().optional(),
});

export const getMessagesParamsSchema = z.object({
  otherUserId: z.string(),
});

