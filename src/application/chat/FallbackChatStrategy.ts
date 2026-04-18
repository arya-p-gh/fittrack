import { ChatStrategy } from './ChatStrategy';
import { AppLogger } from '../common/AppLogger';

export class FallbackChatStrategy implements ChatStrategy {
  constructor(
    private readonly primary: ChatStrategy,
    private readonly fallback: ChatStrategy
  ) {}

  async sendMessage(input: string): Promise<string> {
    try {
      return await this.primary.sendMessage(input);
    } catch (primaryError) {
      AppLogger.warn({
        scope: 'FallbackChatStrategy',
        action: 'primary.sendMessage',
        message: 'Primary strategy failed. Switching to fallback strategy.',
        details: primaryError,
      });

      try {
        return await this.fallback.sendMessage(input);
      } catch (fallbackError) {
        AppLogger.error({
          scope: 'FallbackChatStrategy',
          action: 'fallback.sendMessage',
          message: 'Fallback strategy failed.',
          details: fallbackError,
        });
        throw new Error('Chat service is currently unavailable. Please try again later.');
      }
    }
  }
}
