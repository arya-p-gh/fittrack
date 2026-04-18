type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  scope: string;
  action: string;
  message: string;
  details?: unknown;
}

const writeLog = (level: LogLevel, payload: LogPayload) => {
  const logMessage = `[${payload.scope}] ${payload.action}: ${payload.message}`;

  if (level === 'error') {
    console.error(logMessage, payload.details ?? '');
    return;
  }

  if (level === 'warn') {
    console.warn(logMessage, payload.details ?? '');
    return;
  }

  console.info(logMessage, payload.details ?? '');
};

export const AppLogger = {
  info(payload: LogPayload) {
    writeLog('info', payload);
  },
  warn(payload: LogPayload) {
    writeLog('warn', payload);
  },
  error(payload: LogPayload) {
    writeLog('error', payload);
  },
};
