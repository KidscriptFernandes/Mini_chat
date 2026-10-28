import { SafeUser } from '../domain/entities/user.js';
import { UsersRepository } from '../domain/repositories/users-repository.interface.js';

export interface ListUsersResponse {
  users: SafeUser[];
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<ListUsersResponse> {
    const users = await this.usersRepository.findAll();

    return {
      users: users.map((user) => user.toSafeObject()),
    };
  }
}
