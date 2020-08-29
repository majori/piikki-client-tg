import { CLILoggingLevel } from 'winston';

export default {
  env: {
    prod: process.env.NODE_ENV === 'production',
    dev: process.env.NODE_ENV === 'development',
    test: process.env.NODE_ENV === 'test',
  },
  tg: {
    token: process.env.TELEGRAM_TOKEN!,
    webhook: process.env.TELEGRAM_WEBHOOK,
    port: parseInt(process.env.PORT as string, 10) || 5000,
  },
  piikki: {
    url: process.env.PIIKKI_API_URL,
    token: process.env.PIIKKI_API_TOKEN,
  },
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as CLILoggingLevel,
  },
};
