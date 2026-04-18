import { ChatStrategy } from './ChatStrategy';
import { FallbackChatStrategy } from './FallbackChatStrategy';
import { GeminiStrategy } from './GeminiStrategy';
import { MockStrategy } from './MockStrategy';

export const createChatStrategy = (): ChatStrategy => {
  const mode = String(import.meta.env.VITE_CHAT_STRATEGY ?? '').toLowerCase();

  if (mode === 'mock') {
    return new MockStrategy();
  }

  // GeminiStrategy calls the backend endpoint; provider keys must remain server-side.
  return new FallbackChatStrategy(new GeminiStrategy('/api/chat'), new MockStrategy());
};
