export default {
  env: {
    prod: process.env.NODE_ENV === 'production',
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
};
