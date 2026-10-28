import { User } from '../../src/domain/entities/user.js';
import { UsersRepository } from '../../src/domain/repositories/users-repository.interface.js';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<User> {
    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email.toLowerCase() === email.toLowerCase());
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user ?? null;
  }

  async findAll(): Promise<User[]> {
    return this.items;
  }

  async update(user: User): Promise<User> {
    const index = this.items.findIndex((item) => item.id === user.id);
    if (index !== -1) {
      this.items[index] = user;
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

