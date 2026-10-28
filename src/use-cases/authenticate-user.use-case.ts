import { SafeUser } from '../domain/entities/user.js';
import { UsersRepository } from '../domain/repositories/users-repository.interface.js';
import { PasswordHasher } from '../domain/cryptography/password-hasher.interface.js';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials-error.js';

export interface AuthenticateUserRequest {
  email: string;
  senha: string;
}

export interface AuthenticateUserResponse {
  user: SafeUser;
}

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(request.email.trim().toLowerCase());

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(request.senha, user.senha);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      user: user.toSafeObject(),
    };
  }
}
