import { AppLogger } from '../../application/common/AppLogger';

export const readArrayFromStorage = <T>(storageKey: string, scope: string): T[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      AppLogger.warn({
        scope,
        action: 'readArrayFromStorage',
        message: 'Stored value is not an array. Using empty array fallback.',
      });
      return [];
    }

    return parsed as T[];
  } catch (error) {
    AppLogger.error({
      scope,
      action: 'readArrayFromStorage',
      message: `Failed to parse storage key ${storageKey}. Using empty array fallback.`,
      details: error,
    });
    return [];
  }
};

export const writeArrayToStorage = <T>(storageKey: string, data: T[], scope: string): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    AppLogger.error({
      scope,
      action: 'writeArrayToStorage',
      message: `Failed to persist storage key ${storageKey}.`,
      details: error,
    });

    throw new Error(`[${scope}] Failed to persist ${storageKey}.`);
  }
};
