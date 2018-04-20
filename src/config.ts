import { CLILoggingLevel } from 'winston';

export default {
  env: {
    prod: process.env.NODE_ENV === 'production',
    dev: process.env.NODE_ENV === 'development',
    test: process.env.NODE_ENV === 'test',
  },
  tg: {
    token: process.env.TELEGRAM_TOKEN,
    webhook: process.env.WEBHOOK_DOMAIN,
    port: process.env.PORT || 5000,
  },
  piikki: {
    domain: process.env.PIIKKI_DOMAIN,
    token: process.env.PIIKKI_TOKEN,
  },
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as CLILoggingLevel,
  },
};
