import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config();

const user = process.env.DATABASE_USER || 'root';
const password = process.env.DATABASE_PASSWORD || '';
const host = process.env.DATABASE_HOST || 'localhost';
const port = process.env.DATABASE_PORT || '3306';
const database = process.env.DATABASE_NAME || 'chat';

const url = `mysql://${user}${password ? `:${password}` : ''}@${host}:${port}/${database}`;

export default defineConfig({
  schema: './src/infra/database/schema/index.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url,
  },
});
