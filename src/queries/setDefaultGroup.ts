import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import { Middleware, CallbackQuery } from 'types/bot';
import { IncomingMessage } from 'types/telegraf';

const logger = new Logger(__filename);

const queryHandler: Middleware = async (ctx) => {
  const callbackQuery = ctx.callbackQuery as CallbackQuery;
  const { username } = await api.getUser(ctx.state.username);
  const group = callbackQuery.params[0];

  await api.setDefaultGroup(username, group);
  logger.debug('Set default group', { username, group });

  ctx.reply(`I've succesfully set your default group to *${group}*.`, {
    parse_mode: 'Markdown',
  });
  ctx.deleteMessage((callbackQuery.message as IncomingMessage).message_id);

  return ctx.answerCbQuery();
};

export default queryHandler;
