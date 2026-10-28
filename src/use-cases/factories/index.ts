import { DrizzleUsersRepository } from '../../infra/repositories/drizzle-users-repository.js';
import { DrizzleMessagesRepository } from '../../infra/repositories/drizzle-messages-repository.js';
import { BcryptHasher } from '../../infra/cryptography/bcrypt-hasher.js';

import { RegisterUserUseCase } from '../register-user.use-case.js';
import { AuthenticateUserUseCase } from '../authenticate-user.use-case.js';
import { GetUserProfileUseCase } from '../get-user-profile.use-case.js';
import { UpdateUserProfileUseCase } from '../update-user-profile.use-case.js';
import { ListUsersUseCase } from '../list-users.use-case.js';
import { SendMessageUseCase } from '../send-message.use-case.js';
import { GetChatHistoryUseCase } from '../get-chat-history.use-case.js';

export function makeRegisterUserUseCase(): RegisterUserUseCase {
  const usersRepository = new DrizzleUsersRepository();
  const passwordHasher = new BcryptHasher();
  return new RegisterUserUseCase(usersRepository, passwordHasher);
}

export function makeAuthenticateUserUseCase(): AuthenticateUserUseCase {
  const usersRepository = new DrizzleUsersRepository();
  const passwordHasher = new BcryptHasher();
  return new AuthenticateUserUseCase(usersRepository, passwordHasher);
}

export function makeGetUserProfileUseCase(): GetUserProfileUseCase {
  const usersRepository = new DrizzleUsersRepository();
  return new GetUserProfileUseCase(usersRepository);
}

export function makeUpdateUserProfileUseCase(): UpdateUserProfileUseCase {
  const usersRepository = new DrizzleUsersRepository();
  const passwordHasher = new BcryptHasher();
  return new UpdateUserProfileUseCase(usersRepository, passwordHasher);
}

export function makeListUsersUseCase(): ListUsersUseCase {
  const usersRepository = new DrizzleUsersRepository();
  return new ListUsersUseCase(usersRepository);
}

export function makeSendMessageUseCase(): SendMessageUseCase {
  const messagesRepository = new DrizzleMessagesRepository();
  const usersRepository = new DrizzleUsersRepository();
  return new SendMessageUseCase(messagesRepository, usersRepository);
}

export function makeGetChatHistoryUseCase(): GetChatHistoryUseCase {
  const messagesRepository = new DrizzleMessagesRepository();
  return new GetChatHistoryUseCase(messagesRepository);
}
