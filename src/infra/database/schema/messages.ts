import { mysqlTable, varchar, text } from 'drizzle-orm/mysql-core';
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
  createdAt: varchar('created_at', { length: 50 }).notNull().$defaultFn(() => new Date().toISOString()),
});

export type MessageTable = typeof messages.$inferSelect;
export type InsertMessageTable = typeof messages.$inferInsert;
