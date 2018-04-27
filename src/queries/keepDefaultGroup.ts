import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default async (ctx: any) => {
  const { defaultGroup } = await api.getUser(ctx.state.username);
  const group = ctx.callbackQuery.params[0];

  const reply = defaultGroup ?
    `You are now member of the group *${group}*, ` +
    `but your default group is still *${defaultGroup}*!`
  :
    `You are now member of the group *${group}*, ` +
    `but you don\'t have a default group. You can set ` +
    `it with /setdefault command.`;

  ctx.reply(reply, { parse_mode: 'Markdown' });
  ctx.deleteMessage(ctx.callbackQuery.message.message_id);

  return ctx.answerCbQuery();
};
