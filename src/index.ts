import Telegraf from 'telegraf';
import _ from 'lodash';

import config from './config';
import * as api from './api';

import commands from './commands';
import queries from './queries';
import middlewares from './middlewares';

const bot = new Telegraf(config.tg.token);

// Apply telegram message logger if developing
if (config.env.dev) {
  bot.use(Telegraf.log());
}

// Register middlewares
middlewares(bot);

// Register commands
commands(bot);

// Register responders for inline and callback queries
queries(bot);

// Setup webhook if production
if (config.env.prod) {
  bot.telegram.setWebhook(`${config.tg.webhook}/bot${config.tg.token}`);
  bot.startWebhook(`/bot${config.tg.token}`, null, config.tg.port);

// Do polling in development
} else {
  bot.telegram.deleteWebhook();
  bot.startPolling();
}
