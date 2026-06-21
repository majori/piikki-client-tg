import auth from './auth';
import commandParts from './commandParts';
import type { Telegraf } from 'telegraf';
import type { Context } from '../types/bot';

export default (bot: Telegraf<Context>) => {
  bot.use(commandParts);
  bot.use(auth);
};
