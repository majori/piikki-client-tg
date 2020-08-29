import _ from 'lodash';
import commandParts from 'telegraf-command-parts';
import auth from './auth';
import type { Telegraf } from 'telegraf';
import type { Context } from '../types/bot';

export default (bot: Telegraf<Context>) => {
  bot.use(commandParts());
  bot.use(auth);
};
