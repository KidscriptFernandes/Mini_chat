import { SafeUser } from '../domain/entities/user.js';
import { UsersRepository } from '../domain/repositories/users-repository.interface.js';
import { ResourceNotFoundError } from '../domain/errors/resource-not-found-error.js';

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  user: SafeUser;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findById(request.userId);

    if (!user) {
      throw new ResourceNotFoundError('Usuário');
    }

    return {
      user: user.toSafeObject(),
    };
  }
}
