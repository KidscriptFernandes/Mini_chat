import { mysqlTable, varchar, text, timestamp } from 'drizzle-orm/mysql-core';
import { users } from './users.js';

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  senderId: varchar('sender_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  receiverId: varchar('receiver_id', { length: 36 }).references(() => users.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type MessageTable = typeof messages.$inferSelect;
export type InsertMessageTable = typeof messages.$inferInsert;
