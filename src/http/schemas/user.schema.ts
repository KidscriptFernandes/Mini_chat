import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  idade: z.number(),
  endereco: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const registerBodySchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  idade: z.coerce.number().int().min(0, 'Idade deve ser maior ou igual a 0'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
});

export const authenticateBodySchema = z.object({
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const updateUserBodySchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  idade: z.coerce.number().int().min(0, 'Idade deve ser maior ou igual a 0').optional(),
  endereco: z.string().min(1, 'Endereço não pode ser vazio').optional(),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
});

