import { and, asc, eq, isNull, or } from 'drizzle-orm';
import { db } from '../database/client.js';
import { messages, MessageTable } from '../database/schema/messages.js';
import { Message } from '../../domain/entities/message.js';
import { MessagesRepository } from '../../domain/repositories/messages-repository.interface.js';

export class DrizzleMessagesRepository implements MessagesRepository {
  private toDomain(row: MessageTable): Message {
    return new Message({
      id: row.id,
      senderId: row.senderId,
      receiverId: row.receiverId,
      content: row.content,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    });
  }

  async create(message: Message): Promise<Message> {
    const data = message.toObject();
    await db.insert(messages).values({
      id: data.id,
      senderId: data.senderId,
      receiverId: data.receiverId ?? null,
      content: data.content,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    });

    return message;
  }

  async findDirectMessages(user1Id: string, user2Id: string): Promise<Message[]> {
    const rows = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(asc(messages.createdAt));

    return rows.map((row) => this.toDomain(row));
  }

  async findRecentPublicMessages(limit = 50): Promise<Message[]> {
    const rows = await db
      .select()
      .from(messages)
      .where(isNull(messages.receiverId))
      .orderBy(asc(messages.createdAt))
      .limit(limit);

    return rows.map((row) => this.toDomain(row));
  }
}
