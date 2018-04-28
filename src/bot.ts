import _ from 'lodash';
import { log } from 'telegraf';

import config from './config';
import * as api from './api';
import commands from './commands';
import queries from './queries';
import stages from './stages';
import middlewares from './middlewares';
import { Telegraf } from './types/telegraf';

export default async (bot: Telegraf) => {
  // Apply telegram message logger if developing
  if (config.env.dev) {
    bot.use(log());
  }

  // Register middlewares
  middlewares(bot);

  // Register stages
  stages(bot);

  // Register commands
  commands(bot);

  // Register responders for inline and callback queries
  queries(bot);

  return bot;
};
