import { mysqlTable, varchar, int, text } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  idade: int('idade').notNull(),
  endereco: text('endereco').notNull(),
  createdAt: varchar('created_at', { length: 50 }).notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: varchar('updated_at', { length: 50 }).notNull().$defaultFn(() => new Date().toISOString()),
});

export type UserTable = typeof users.$inferSelect;
export type InsertUserTable = typeof users.$inferInsert;
