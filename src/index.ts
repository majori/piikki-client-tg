import config from './config';
import createBot from './bot';
import Telegraf from 'telegraf';
import Logger from './logger';

const logger = new Logger(__filename);

async function start() {
  const bot = await createBot(new Telegraf(config.tg.token));

  // Setup webhook if production
  if (config.env.prod) {
    const webhook = `${config.tg.webhook}/bot${config.tg.token}`;
    bot.telegram.setWebhook(webhook);
    bot.startWebhook(`/bot${config.tg.token}`, {}, config.tg.port);
    logger.info(`Webhook listening at ${webhook}`);

  // Do polling in development
  } else {
    bot.telegram.deleteWebhook();
    bot.startPolling();
    logger.info('Polling started for updates');
  }
}

start();
