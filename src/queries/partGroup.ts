import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);
  const group = ctx.callbackQuery.params[0];
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
    ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  }
  return ctx.answerCbQuery();
};
