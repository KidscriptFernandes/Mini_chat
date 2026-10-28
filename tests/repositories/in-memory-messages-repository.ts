import { Message } from '../../src/domain/entities/message.js';
import { MessagesRepository } from '../../src/domain/repositories/messages-repository.interface.js';

export class InMemoryMessagesRepository implements MessagesRepository {
  public items: Message[] = [];

  async create(message: Message): Promise<Message> {
    this.items.push(message);
    return message;
  }

  async findDirectMessages(user1Id: string, user2Id: string): Promise<Message[]> {
    return this.items.filter((msg) => {
      const sender = msg.senderId;
      const receiver = msg.receiverId;
      return (
        (sender === user1Id && receiver === user2Id) ||
        (sender === user2Id && receiver === user1Id)
      );
    });
  }

  async findRecentPublicMessages(limit = 50): Promise<Message[]> {
    const publicMessages = this.items.filter((msg) => !msg.receiverId);
    return publicMessages.slice(-limit);
  }
}

