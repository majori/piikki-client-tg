import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import { Middleware, CallbackQuery } from 'types/bot';
import { IncomingMessage } from 'types/telegraf';

const logger = new Logger(__dirname);

const queryHandler: Middleware = async (ctx) => {
  const callbackQuery = ctx.callbackQuery as CallbackQuery;
  const { defaultGroup } = await api.getUser(ctx.state.username);
  const group = callbackQuery.params[0];

  const reply = defaultGroup ?
    `You are now member of the group *${group}*, ` +
    `but your default group is still *${defaultGroup}*!`
  :
    `You are now member of the group *${group}*, ` +
    `but you don\'t have a default group. You can set ` +
    `it with /setdefault command.`;

  ctx.reply(reply, { parse_mode: 'Markdown' });
  ctx.deleteMessage((callbackQuery.message as IncomingMessage).message_id);

  return ctx.answerCbQuery();
};

export default queryHandler;
