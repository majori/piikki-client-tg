import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import type { Context } from 'types/bot';

const logger = new Logger(__filename);

const queryHandler = async (ctx: Context, group: string) => {
  const callbackQuery = ctx.callbackQuery!;
  const { username, saldos } = await api.getUser(ctx.state.username);
  const saldo = Number(saldos[group]);

  if (saldo !== 0) {
    ctx.reply(
      `You can only part from groups where your saldo is 0, ` +
        `your current saldo in *${group}* is *${saldo}*!`,
      { parse_mode: 'Markdown' },
    );
  } else {
    await api.partGroup(username, group);
    ctx.reply(`You have parted from the group *${group}*!`, {
      parse_mode: 'Markdown',
    });
    ctx.deleteMessage(callbackQuery.message!.message_id);
  }
  return ctx.answerCbQuery();
};

export default queryHandler;
