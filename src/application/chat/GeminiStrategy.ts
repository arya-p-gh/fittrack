import { ChatStrategy } from './ChatStrategy';
import { sanitizeChatInput } from './chatUtils';

interface ChatApiResponse {
  reply?: string;
}

export class GeminiStrategy implements ChatStrategy {
  constructor(
    private readonly endpoint = '/api/chat',
    private readonly timeoutMs = 10000
  ) {}

  async sendMessage(input: string): Promise<string> {
    const message = sanitizeChatInput(input);
    if (!message) {
      throw new Error('[GeminiStrategy] Message cannot be empty.');
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Chat backend request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      if (!data.reply || typeof data.reply !== 'string') {
        throw new Error('Chat backend response is missing reply text');
      }

      return data.reply;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('[GeminiStrategy] Request timed out.');
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}
