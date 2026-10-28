import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository.js';
import { FakeHasher } from '../cryptography/fake-hasher.js';
import { RegisterUserUseCase } from '../../src/use-cases/register-user.use-case.js';
import { AuthenticateUserUseCase } from '../../src/use-cases/authenticate-user.use-case.js';
import { UserAlreadyExistsError } from '../../src/domain/errors/user-already-exists-error.js';
import { InvalidCredentialsError } from '../../src/domain/errors/invalid-credentials-error.js';

describe('Auth Use Cases', () => {
  let usersRepository: InMemoryUsersRepository;
  let passwordHasher: FakeHasher;
  let registerUseCase: RegisterUserUseCase;
  let authenticateUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    passwordHasher = new FakeHasher();
    registerUseCase = new RegisterUserUseCase(usersRepository, passwordHasher);
    authenticateUseCase = new AuthenticateUserUseCase(usersRepository, passwordHasher);
  });

  it('should register a new user successfully', async () => {
    const { user } = await registerUseCase.execute({
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: 'password123',
      idade: 25,
      endereco: 'Rua das Flores, 123',
    });

    expect(user.id).toBeDefined();
    expect(user.nome).toBe('João Silva');
    expect(user.email).toBe('joao@example.com');
    expect(user.idade).toBe(25);
    expect(user.endereco).toBe('Rua das Flores, 123');
    expect((user as any).senha).toBeUndefined();

    const stored = await usersRepository.findByEmail('joao@example.com');
    expect(stored).toBeDefined();
    expect(stored?.senha).toBe('password123-hashed');
  });

  it('should not allow registering an already existing email', async () => {
    await registerUseCase.execute({
      nome: 'Primeiro',
      email: 'teste@example.com',
      senha: 'secret',
      idade: 30,
      endereco: 'Av Central',
    });

    await expect(
      registerUseCase.execute({
        nome: 'Segundo',
        email: 'teste@example.com',
        senha: 'outro',
        idade: 22,
        endereco: 'Outro',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should authenticate a valid user', async () => {
    await registerUseCase.execute({
      nome: 'Maria Silva',
      email: 'maria@example.com',
      senha: 'minhasenha',
      idade: 28,
      endereco: 'Rua B',
    });

    const { user } = await authenticateUseCase.execute({
      email: 'maria@example.com',
      senha: 'minhasenha',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('maria@example.com');
  });

  it('should reject authentication with non-existing email', async () => {
    await expect(
      authenticateUseCase.execute({
        email: 'inexistente@example.com',
        senha: '123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should reject authentication with wrong password', async () => {
    await registerUseCase.execute({
      nome: 'Carlos',
      email: 'carlos@example.com',
      senha: 'senha-correta',
      idade: 35,
      endereco: 'Rua C',
    });

    await expect(
      authenticateUseCase.execute({
        email: 'carlos@example.com',
        senha: 'senha-errada',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

