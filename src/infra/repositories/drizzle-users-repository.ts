import { eq } from 'drizzle-orm';
import { db } from '../database/client.js';
import { users, UserTable } from '../database/schema/users.js';
import { User } from '../../domain/entities/user.js';
import { UsersRepository } from '../../domain/repositories/users-repository.interface.js';

export class DrizzleUsersRepository implements UsersRepository {
  private toDomain(row: UserTable): User {
    return new User({
      id: row.id,
      nome: row.nome,
      email: row.email,
      senha: row.senha,
      idade: row.idade,
      endereco: row.endereco,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
      updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
    });
  }

  async create(user: User): Promise<User> {
    const data = user.toObject();
    await db.insert(users).values({
      id: data.id,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      idade: data.idade,
      endereco: data.endereco,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!row) return null;
    return this.toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!row) return null;
    return this.toDomain(row);
  }

  async findAll(): Promise<User[]> {
    const rows = await db.select().from(users);
    return rows.map((row) => this.toDomain(row));
  }

  async update(user: User): Promise<User> {
    const data = user.toObject();
    await db
      .update(users)
      .set({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        idade: data.idade,
        endereco: data.endereco,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(users.id, data.id));

    return user;
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
