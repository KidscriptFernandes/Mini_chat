# Chat Service

Backend service for authentication, users, and messaging built with Fastify, TypeScript, Drizzle ORM, and MySQL.

## Requirements

- Node.js >= 20
- MySQL >= 8.0 (or MariaDB via XAMPP)

## Environment Variables

Configured in `.env`:

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
JWT_SECRET=super-secret-jwt-key-change-in-production-123456
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=chat
CORS_ORIGIN=*
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=1 minute
```

The database and required tables are initialized automatically on boot if they do not exist.

## Scripts

- `npm run dev` - Run development server with watch mode
- `npm run build` - Compile TypeScript to `dist/`
- `npm start` - Run production server from `dist/server.js`
- `npm test` - Run test suite with Vitest
- `npm run db:push` - Push schema directly via Drizzle Kit
- `npm run db:studio` - Open Drizzle Studio

## API Endpoints

OpenAPI / Swagger UI documentation is available at `/docs`.

### Auth
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and obtain JWT

### Users (Bearer Auth)
- `GET /users/me` - Get profile of authenticated user
- `PUT /users/me` - Update profile
- `GET /users` - List all users

### Messages (Bearer Auth)
- `POST /messages` - Send message (public if `receiverId` is omitted, direct if provided)
- `GET /messages` - Get public messages or direct conversation via `?otherUserId=`
- `GET /messages/:otherUserId` - Get direct conversation with specific user

### System
- `GET /health` - Service health status
