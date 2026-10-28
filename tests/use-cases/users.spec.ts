import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository.js';
import { FakeHasher } from '../cryptography/fake-hasher.js';
import { GetUserProfileUseCase } from '../../src/use-cases/get-user-profile.use-case.js';
import { UpdateUserProfileUseCase } from '../../src/use-cases/update-user-profile.use-case.js';
import { ListUsersUseCase } from '../../src/use-cases/list-users.use-case.js';
import { RegisterUserUseCase } from '../../src/use-cases/register-user.use-case.js';
import { ResourceNotFoundError } from '../../src/domain/errors/resource-not-found-error.js';

describe('Users Use Cases', () => {
  let usersRepository: InMemoryUsersRepository;
  let passwordHasher: FakeHasher;
  let getUserProfileUseCase: GetUserProfileUseCase;
  let updateUserProfileUseCase: UpdateUserProfileUseCase;
  let listUsersUseCase: ListUsersUseCase;
  let registerUseCase: RegisterUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    passwordHasher = new FakeHasher();
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
    updateUserProfileUseCase = new UpdateUserProfileUseCase(usersRepository, passwordHasher);
    listUsersUseCase = new ListUsersUseCase(usersRepository);
    registerUseCase = new RegisterUserUseCase(usersRepository, passwordHasher);
  });

  it('should retrieve an existing user profile', async () => {
    const { user: registered } = await registerUseCase.execute({
      nome: 'Ana Lima',
      email: 'ana@example.com',
      senha: 'password123',
      idade: 22,
      endereco: 'Rua das Palmeiras, 45',
    });

    const { user } = await getUserProfileUseCase.execute({ userId: registered.id });
    expect(user.id).toBe(registered.id);
    expect(user.nome).toBe('Ana Lima');
    expect(user.email).toBe('ana@example.com');
  });

  it('should throw ResourceNotFoundError when profile does not exist', async () => {
    await expect(
      getUserProfileUseCase.execute({ userId: 'id-nao-existente' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should update user profile information', async () => {
    const { user: registered } = await registerUseCase.execute({
      nome: 'Lucas Santos',
      email: 'lucas@example.com',
      senha: 'password123',
      idade: 29,
      endereco: 'Rua Antiga',
    });

    const { user: updated } = await updateUserProfileUseCase.execute({
      userId: registered.id,
      nome: 'Lucas Silva Santos',
      idade: 30,
      endereco: 'Rua Nova, 999',
    });

    expect(updated.nome).toBe('Lucas Silva Santos');
    expect(updated.idade).toBe(30);
    expect(updated.endereco).toBe('Rua Nova, 999');
  });

  it('should list all registered users', async () => {
    await registerUseCase.execute({
      nome: 'User 1',
      email: 'user1@example.com',
      senha: '123456',
      idade: 20,
      endereco: 'End 1',
    });
    await registerUseCase.execute({
      nome: 'User 2',
      email: 'user2@example.com',
      senha: '123456',
      idade: 25,
      endereco: 'End 2',
    });

    const { users } = await listUsersUseCase.execute();
    expect(users).toHaveLength(2);
    expect(users.map((u) => u.email)).toContain('user1@example.com');
    expect(users.map((u) => u.email)).toContain('user2@example.com');
  });
});

