import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import { Middleware, CallbackQuery } from 'types/bot';
import { IncomingMessage } from 'types/telegraf';

const logger = new Logger(__dirname);

const queryHandler: Middleware = async (ctx) => {
  const callbackQuery = ctx.callbackQuery as CallbackQuery;
  const { username, saldos } = await api.getUser(ctx.state.username);
  const group = callbackQuery.params[0];
  const saldo = Number(saldos[group]);

  if (saldo !== 0) {
    ctx.reply(
      `You can only part from groups where your saldo is 0, ` +
      `your current saldo in *${group}* is *${saldo}*!`,
      { parse_mode: 'Markdown' },
    );
  } else {
    await api.partGroup(username, group);
    ctx.reply(
      `You have parted from the group *${group}*!`,
      { parse_mode: 'Markdown' },
    );
    ctx.deleteMessage((callbackQuery.message as IncomingMessage).message_id);
  }
  return ctx.answerCbQuery();
};

export default queryHandler;
