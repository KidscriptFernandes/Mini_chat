import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { DomainError } from '../../domain/errors/domain-error.js';
import { env } from '../../infra/env/index.js';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof DomainError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    });
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Falha na validação dos dados da requisição.',
      issues: error.validation,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Dados enviados na requisição são inválidos.',
      issues: error.flatten().fieldErrors,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Falha na validação dos parâmetros da requisição.',
      details: error.message,
    });
  }

  if (error.statusCode === 429) {
    return reply.status(429).send({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Muitas requisições enviadas em um curto período. Tente novamente mais tarde.',
    });
  }

  if (env.NODE_ENV !== 'production') {
    request.log.error(error);
  }

  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Ocorreu um erro interno no servidor.',
  });
}
