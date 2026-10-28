import { app } from './app.js';
import { env } from './infra/env/index.js';
import { initializeDatabase, closeDatabase } from './infra/database/client.js';

async function bootstrap() {
  try {
    await initializeDatabase();
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });
    const host = env.HOST === '0.0.0.0' ? 'localhost' : env.HOST;
    console.log(`Server listening on http://${env.HOST}:${env.PORT}`);
    console.log(`Swagger documentation: http://${host}:${env.PORT}/docs`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

const shutdown = async (signal: string) => {
  try {
    await app.close();
    await closeDatabase();
    process.exit(0);
  } catch (err) {
    console.error(`Error during ${signal} shutdown:`, err);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

bootstrap();
