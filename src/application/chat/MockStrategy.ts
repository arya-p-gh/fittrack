import { ChatStrategy } from './ChatStrategy';
import { sanitizeChatInput } from './chatUtils';

export class MockStrategy implements ChatStrategy {
  async sendMessage(input: string): Promise<string> {
    const message = sanitizeChatInput(input);
    if (!message) {
      return 'Please enter a message to continue.';
    }

    return `Mock response for: ${message}`;
  }
}
