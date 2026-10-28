import { DomainError } from './domain-error.js';

export class InvalidCredentialsError extends DomainError {
  readonly statusCode = 401;

  constructor() {
    super('Email ou senha inválidos.');
  }
}
