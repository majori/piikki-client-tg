import Telegraf from 'telegraf';
import _ from 'lodash';

import config from './config';
import * as api from './api';
import commands from './commands';
import middlewares from './middlewares';

const bot = new Telegraf(config.tg.token);

// Register middlewares
middlewares(bot);

// Register commands
commands(bot);

if (!config.env.prod) {
  bot.telegram.deleteWebhook();
  bot.startPolling();
} else {
  bot.telegram.setWebhook(`${config.tg.webhook}/bot${config.tg.token}`);
  bot.startWebhook(`/bot${config.tg.token}`, null, config.tg.port);
}
