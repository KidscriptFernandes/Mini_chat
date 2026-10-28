import { MessageProps } from '../domain/entities/message.js';
import { MessagesRepository } from '../domain/repositories/messages-repository.interface.js';

export interface GetChatHistoryRequest {
  currentUserId: string;
  otherUserId?: string;
}

export interface GetChatHistoryResponse {
  messages: MessageProps[];
}

export class GetChatHistoryUseCase {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute(request: GetChatHistoryRequest): Promise<GetChatHistoryResponse> {
    if (request.otherUserId) {
      const directMessages = await this.messagesRepository.findDirectMessages(
        request.currentUserId,
        request.otherUserId
      );

      return {
        messages: directMessages.map((msg) => msg.toObject()),
      };
    }

    const publicMessages = await this.messagesRepository.findRecentPublicMessages(50);

    return {
      messages: publicMessages.map((msg) => msg.toObject()),
    };
  }
}
