import { SafeUser } from '../domain/entities/user.js';
import { UsersRepository } from '../domain/repositories/users-repository.interface.js';
import { PasswordHasher } from '../domain/cryptography/password-hasher.interface.js';
import { ResourceNotFoundError } from '../domain/errors/resource-not-found-error.js';

export interface UpdateUserProfileRequest {
  userId: string;
  nome?: string;
  idade?: number;
  endereco?: string;
  senha?: string;
}

export interface UpdateUserProfileResponse {
  user: SafeUser;
}

export class UpdateUserProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    const user = await this.usersRepository.findById(request.userId);

    if (!user) {
      throw new ResourceNotFoundError('Usuário');
    }

    if (request.nome !== undefined) {
      user.nome = request.nome.trim();
    }

    if (request.idade !== undefined) {
      user.idade = request.idade;
    }

    if (request.endereco !== undefined) {
      user.endereco = request.endereco.trim();
    }

    if (request.senha !== undefined && request.senha.length > 0) {
      user.senha = await this.passwordHasher.hash(request.senha);
    }

    await this.usersRepository.update(user);

    return {
      user: user.toSafeObject(),
    };
  }
}
