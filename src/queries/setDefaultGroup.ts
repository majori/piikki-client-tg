import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import type { Context } from 'types/bot';

const logger = new Logger(__filename);

const queryHandler = async (ctx: Context, group: string) => {
  const callbackQuery = ctx.callbackQuery!;
  const { username } = await api.getUser(ctx.state.username);

  await api.setDefaultGroup(username, group);
  logger.debug('Set default group', { username, group });

  ctx.reply(`I've succesfully set your default group to *${group}*.`, {
    parse_mode: 'Markdown',
  });
  ctx.deleteMessage(callbackQuery.message!.message_id);

  return ctx.answerCbQuery();
};

export default queryHandler;
