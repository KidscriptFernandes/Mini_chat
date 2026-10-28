import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository.js';
import { InMemoryMessagesRepository } from '../repositories/in-memory-messages-repository.js';
import { SendMessageUseCase } from '../../src/use-cases/send-message.use-case.js';
import { GetChatHistoryUseCase } from '../../src/use-cases/get-chat-history.use-case.js';
import { User } from '../../src/domain/entities/user.js';
import { ResourceNotFoundError } from '../../src/domain/errors/resource-not-found-error.js';

describe('Messages Use Cases', () => {
  let usersRepository: InMemoryUsersRepository;
  let messagesRepository: InMemoryMessagesRepository;
  let sendMessageUseCase: SendMessageUseCase;
  let getChatHistoryUseCase: GetChatHistoryUseCase;

  let user1: User;
  let user2: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    messagesRepository = new InMemoryMessagesRepository();
    sendMessageUseCase = new SendMessageUseCase(messagesRepository, usersRepository);
    getChatHistoryUseCase = new GetChatHistoryUseCase(messagesRepository);

    user1 = new User({
      id: 'user-1',
      nome: 'User Um',
      email: 'u1@example.com',
      senha: 'hashed',
      idade: 20,
      endereco: 'Rua 1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    user2 = new User({
      id: 'user-2',
      nome: 'User Dois',
      email: 'u2@example.com',
      senha: 'hashed',
      idade: 22,
      endereco: 'Rua 2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await usersRepository.create(user1);
    await usersRepository.create(user2);
  });

  it('should send a public message successfully', async () => {
    const { message } = await sendMessageUseCase.execute({
      senderId: user1.id,
      content: 'Olá a todos no chat público!',
    });

    expect(message.id).toBeDefined();
    expect(message.senderId).toBe(user1.id);
    expect(message.receiverId).toBeNull();
    expect(message.content).toBe('Olá a todos no chat público!');
  });

  it('should send a direct message successfully', async () => {
    const { message } = await sendMessageUseCase.execute({
      senderId: user1.id,
      receiverId: user2.id,
      content: 'Oi User Dois, mensagem privada',
    });

    expect(message.id).toBeDefined();
    expect(message.senderId).toBe(user1.id);
    expect(message.receiverId).toBe(user2.id);
    expect(message.content).toBe('Oi User Dois, mensagem privada');
  });

  it('should fail sending message if sender does not exist', async () => {
    await expect(
      sendMessageUseCase.execute({
        senderId: 'invalid-sender',
        content: 'Teste',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should fail sending message if receiver does not exist', async () => {
    await expect(
      sendMessageUseCase.execute({
        senderId: user1.id,
        receiverId: 'invalid-receiver',
        content: 'Teste',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should fetch public messages history', async () => {
    await sendMessageUseCase.execute({
      senderId: user1.id,
      content: 'Public Msg 1',
    });
    await sendMessageUseCase.execute({
      senderId: user2.id,
      content: 'Public Msg 2',
    });

    const { messages } = await getChatHistoryUseCase.execute({
      currentUserId: user1.id,
    });

    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe('Public Msg 1');
    expect(messages[1].content).toBe('Public Msg 2');
  });

  it('should fetch direct messages history between two users', async () => {
    await sendMessageUseCase.execute({
      senderId: user1.id,
      receiverId: user2.id,
      content: 'DM 1',
    });
    await sendMessageUseCase.execute({
      senderId: user2.id,
      receiverId: user1.id,
      content: 'DM 2',
    });
    await sendMessageUseCase.execute({
      senderId: user1.id,
      content: 'Not a DM',
    });

    const { messages } = await getChatHistoryUseCase.execute({
      currentUserId: user1.id,
      otherUserId: user2.id,
    });

    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe('DM 1');
    expect(messages[1].content).toBe('DM 2');
  });
});

