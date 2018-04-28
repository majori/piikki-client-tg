import _ from 'lodash';
import commandParts from 'telegraf-command-parts';
import auth from './auth';
import { Telegraf } from 'types/telegraf';

export default (bot: Telegraf) => {
  bot.use(commandParts());
  bot.use(auth);
};
