import crypto from 'node:crypto';
import { User, SafeUser } from '../domain/entities/user.js';
import { UsersRepository } from '../domain/repositories/users-repository.interface.js';
import { PasswordHasher } from '../domain/cryptography/password-hasher.interface.js';
import { UserAlreadyExistsError } from '../domain/errors/user-already-exists-error.js';

export interface RegisterUserRequest {
  nome: string;
  email: string;
  senha: string;
  idade: number;
  endereco: string;
}

export interface RegisterUserResponse {
  user: SafeUser;
}

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const existingUser = await this.usersRepository.findByEmail(request.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(request.email);
    }

    const hashedPassword = await this.passwordHasher.hash(request.senha);
    const now = new Date().toISOString();

    const user = new User({
      id: crypto.randomUUID(),
      nome: request.nome.trim(),
      email: request.email.trim().toLowerCase(),
      senha: hashedPassword,
      idade: request.idade,
      endereco: request.endereco.trim(),
      createdAt: now,
      updatedAt: now,
    });

    await this.usersRepository.create(user);

    return {
      user: user.toSafeObject(),
    };
  }
}
