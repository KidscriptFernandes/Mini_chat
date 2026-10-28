import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../src/app.js';
import { initializeDatabase, closeDatabase } from '../../src/infra/database/client.js';

describe('HTTP API End-to-End Tests', () => {
  const app = buildApp();

  beforeAll(async () => {
    await initializeDatabase();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await closeDatabase();
  });

  it('GET /health - should return status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
    expect(body.uptime).toBeDefined();
  });

  describe('Authentication and Users Flow', () => {
    const testEmail = `test_${Date.now()}@example.com`;
    let userToken: string;
    let userId: string;

    it('POST /auth/register - should create a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          nome: 'Usuario Teste E2E',
          email: testEmail,
          senha: 'senha-segura-123',
          idade: 26,
          endereco: 'Avenida Brasil, 100',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(testEmail);
      expect(body.user.senha).toBeUndefined();
      userId = body.user.id;
    });

    it('POST /auth/register - should fail on duplicate email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          nome: 'Duplicado',
          email: testEmail,
          senha: 'senha-segura-123',
          idade: 30,
          endereco: 'Outro',
        },
      });

      expect(response.statusCode).toBe(409);
      const body = response.json();
      expect(body.error).toBe('UserAlreadyExistsError');
    });

    it('POST /auth/login - should authenticate and return JWT token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: testEmail,
          senha: 'senha-segura-123',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.token).toBeDefined();
      expect(body.user.email).toBe(testEmail);
      userToken = body.token;
    });

    it('GET /users/me - should fail without authentication token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
      });

      expect(response.statusCode).toBe(401);
    });

    it('GET /users/me - should return user profile when authenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.user.id).toBe(userId);
      expect(body.user.email).toBe(testEmail);
      expect(body.user.nome).toBe('Usuario Teste E2E');
    });

    it('PUT /users/me - should update current user profile', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: {
          nome: 'Usuario Nome Atualizado',
          idade: 27,
          endereco: 'Nova Rua, 500',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.user.nome).toBe('Usuario Nome Atualizado');
      expect(body.user.idade).toBe(27);
      expect(body.user.endereco).toBe('Nova Rua, 500');
    });

    it('GET /users - should list users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body.users)).toBe(true);
      expect(body.users.some((u: any) => u.id === userId)).toBe(true);
    });
  });

  describe('Messages Flow', () => {
    let token1: string;
    let token2: string;
    let user1Id: string;
    let user2Id: string;

    beforeAll(async () => {
      const email1 = `chat1_${Date.now()}@example.com`;
      const email2 = `chat2_${Date.now()}@example.com`;

      const reg1 = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          nome: 'Chatter 1',
          email: email1,
          senha: 'password123',
          idade: 21,
          endereco: 'Rua 1',
        },
      });
      user1Id = reg1.json().user.id;

      const login1 = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: email1, senha: 'password123' },
      });
      token1 = login1.json().token;

      const reg2 = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          nome: 'Chatter 2',
          email: email2,
          senha: 'password123',
          idade: 23,
          endereco: 'Rua 2',
        },
      });
      user2Id = reg2.json().user.id;

      const login2 = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: email2, senha: 'password123' },
      });
      token2 = login2.json().token;
    });

    it('POST /messages - should send a public message', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/messages',
        headers: {
          authorization: `Bearer ${token1}`,
        },
        payload: {
          content: 'Mensagem de teste no chat publico!',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.message).toBeDefined();
      expect(body.message.senderId).toBe(user1Id);
      expect(body.message.receiverId).toBeNull();
      expect(body.message.content).toBe('Mensagem de teste no chat publico!');
    });

    it('POST /messages - should send a direct message to user2', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/messages',
        headers: {
          authorization: `Bearer ${token1}`,
        },
        payload: {
          receiverId: user2Id,
          content: 'Mensagem privada de chatter 1 para chatter 2',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.message.senderId).toBe(user1Id);
      expect(body.message.receiverId).toBe(user2Id);
    });

    it('GET /messages - should retrieve public chat history', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/messages',
        headers: {
          authorization: `Bearer ${token2}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body.messages)).toBe(true);
      expect(
        body.messages.some((m: any) => m.content === 'Mensagem de teste no chat publico!')
      ).toBe(true);
    });

    it('GET /messages/:otherUserId - should retrieve DM history between user1 and user2', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/messages/${user1Id}`,
        headers: {
          authorization: `Bearer ${token2}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body.messages)).toBe(true);
      expect(
        body.messages.some((m: any) => m.content === 'Mensagem privada de chatter 1 para chatter 2')
      ).toBe(true);
    });
  });
});
