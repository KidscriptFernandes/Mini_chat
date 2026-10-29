import { mysqlTable, varchar, int, text, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: text('senha').notNull(),
  idade: int('idade').notNull(),
  endereco: text('endereco').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type UserTable = typeof users.$inferSelect;
export type InsertUserTable = typeof users.$inferInsert;
