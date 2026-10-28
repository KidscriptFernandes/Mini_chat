import { DomainError } from './domain-error.js';

export class UnauthorizedError extends DomainError {
  readonly statusCode = 401;

  constructor(message = 'Acesso não autorizado.') {
    super(message);
  }
}
