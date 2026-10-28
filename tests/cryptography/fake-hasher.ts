import { PasswordHasher } from '../../src/domain/cryptography/password-hasher.interface.js';

export class FakeHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `${plain}-hashed`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return `${plain}-hashed` === hashed;
  }
}

