import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default async (ctx: any) => {
  const { username } = await api.getUser(ctx.state.username);
  const group = ctx.callbackQuery.params[0];

  await api.setDefaultGroup(username, group);
  logger.debug('Set default group', { username, group });

  ctx.reply(
    `I've succesfully set your default group to *${group}*.`,
    { parse_mode: 'Markdown' },
  );
  ctx.deleteMessage(ctx.callbackQuery.message.message_id);

  return ctx.answerCbQuery();
};
