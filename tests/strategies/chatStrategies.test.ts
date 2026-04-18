import { describe, expect, it, vi } from 'vitest';
import { MockStrategy } from '../../src/application/chat/MockStrategy';
import { FallbackChatStrategy } from '../../src/application/chat/FallbackChatStrategy';
import { ChatStrategy } from '../../src/application/chat/ChatStrategy';

describe('Chat strategies', () => {
  it('MockStrategy returns deterministic response', async () => {
    const strategy = new MockStrategy();

    await expect(strategy.sendMessage('  hello   world ')).resolves.toBe(
      'Mock response for: hello world'
    );
  });

  it('FallbackChatStrategy uses primary when primary succeeds', async () => {
    const primary: ChatStrategy = {
      sendMessage: vi.fn().mockResolvedValue('primary-response'),
    };

    const fallback: ChatStrategy = {
      sendMessage: vi.fn().mockResolvedValue('fallback-response'),
    };

    const strategy = new FallbackChatStrategy(primary, fallback);
    const result = await strategy.sendMessage('test');

    expect(result).toBe('primary-response');
    expect(primary.sendMessage).toHaveBeenCalledTimes(1);
    expect(fallback.sendMessage).not.toHaveBeenCalled();
  });

  it('FallbackChatStrategy uses fallback when primary fails', async () => {
    const primary: ChatStrategy = {
      sendMessage: vi.fn().mockRejectedValue(new Error('primary-failed')),
    };

    const fallback: ChatStrategy = {
      sendMessage: vi.fn().mockResolvedValue('fallback-response'),
    };

    const strategy = new FallbackChatStrategy(primary, fallback);
    const result = await strategy.sendMessage('test');

    expect(result).toBe('fallback-response');
    expect(primary.sendMessage).toHaveBeenCalledTimes(1);
    expect(fallback.sendMessage).toHaveBeenCalledTimes(1);
  });
});
