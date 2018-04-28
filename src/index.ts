import config from './config';
import createBot from './bot';
import Telegraf from 'telegraf';

async function start() {
  const bot = await createBot(new Telegraf(config.tg.token));

  // Setup webhook if production
  if (config.env.prod) {
    bot.telegram.setWebhook(`${config.tg.webhook}/bot${config.tg.token}`);
    bot.startWebhook(`/bot${config.tg.token}`, {}, config.tg.port);

  // Do polling in development
  } else {
    bot.telegram.deleteWebhook();
    bot.startPolling();
  }
}

start();
