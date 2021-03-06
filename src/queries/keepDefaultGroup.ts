import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import type { Context } from 'types/bot';

const logger = new Logger(__filename);

const queryHandler = async (ctx: Context, group: string) => {
  const callbackQuery = ctx.callbackQuery!;
  const { defaultGroup } = await api.getUser(ctx.state.username);

  const reply = defaultGroup
    ? `You are now member of the group *${group}*, ` +
      `but your default group is still *${defaultGroup}*!`
    : `You are now member of the group *${group}*, ` +
      `but you don\'t have a default group. You can set ` +
      `it with /setdefault command.`;

  ctx.reply(reply, { parse_mode: 'Markdown' });
  ctx.deleteMessage(callbackQuery.message!.message_id);

  return ctx.answerCbQuery();
};

export default queryHandler;
