import { DomainError } from './domain-error.js';

export class ResourceNotFoundError extends DomainError {
  readonly statusCode = 404;

  constructor(resourceName = 'Recurso') {
    super(`${resourceName} não encontrado.`);
  }
}
