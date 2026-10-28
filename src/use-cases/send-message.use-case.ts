import crypto from 'node:crypto';
import { Message, MessageProps } from '../domain/entities/message.js';
import { MessagesRepository } from '../domain/repositories/messages-repository.interface.js';
import { UsersRepository } from '../domain/repositories/users-repository.interface.js';
import { ResourceNotFoundError } from '../domain/errors/resource-not-found-error.js';

export interface SendMessageRequest {
  senderId: string;
  receiverId?: string | null;
  content: string;
}

export interface SendMessageResponse {
  message: MessageProps;
}

export class SendMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute(request: SendMessageRequest): Promise<SendMessageResponse> {
    const sender = await this.usersRepository.findById(request.senderId);
    if (!sender) {
      throw new ResourceNotFoundError('Remetente');
    }

    if (request.receiverId) {
      const receiver = await this.usersRepository.findById(request.receiverId);
      if (!receiver) {
        throw new ResourceNotFoundError('Destinatário');
      }
    }

    const message = new Message({
      id: crypto.randomUUID(),
      senderId: request.senderId,
      receiverId: request.receiverId ?? null,
      content: request.content.trim(),
      createdAt: new Date().toISOString(),
    });

    await this.messagesRepository.create(message);

    return {
      message: message.toObject(),
    };
  }
}
