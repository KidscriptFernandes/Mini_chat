import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../domain/cryptography/password-hasher.interface.js';

export class BcryptHasher implements PasswordHasher {
  private readonly saltRounds = 8;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
