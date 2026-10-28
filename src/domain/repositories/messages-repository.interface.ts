import { Message } from '../entities/message.js';

export interface MessagesRepository {
  create(message: Message): Promise<Message>;
  findDirectMessages(user1Id: string, user2Id: string): Promise<Message[]>;
  findRecentPublicMessages(limit?: number): Promise<Message[]>;
}
