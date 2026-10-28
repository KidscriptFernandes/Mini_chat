import { DomainError } from './domain-error.js';

export class UserAlreadyExistsError extends DomainError {
  readonly statusCode = 409;

  constructor(email: string) {
    super(`O usuário com o email "${email}" já está cadastrado.`);
  }
}
