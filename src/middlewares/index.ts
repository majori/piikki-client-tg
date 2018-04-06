import _ from 'lodash';
import commandParts from 'telegraf-command-parts';
import auth from './auth';

export default (bot: any) => {
  bot.use(commandParts());
  bot.use(auth);
};
