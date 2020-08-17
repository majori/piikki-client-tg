import _ from 'lodash';
import type { Telegraf } from 'telegraf';
import type { Context } from './types/bot';

import commands from './commands';
import queries from './queries';
import stages from './stages';
import middlewares from './middlewares';

export default async (bot: Telegraf<Context>) => {
  // Apply telegram message logger if developing

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
