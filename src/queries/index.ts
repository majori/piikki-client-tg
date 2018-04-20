import _ from 'lodash';
import { sessions } from '../middlewares/auth';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default (bot: any) => {
  bot.on('callback_query', async (ctx: any) => {
    logger.debug('Callback Query', ctx.update.callback_query);
    if (ctx.update.callback_query.data) {
      const params = _.split(ctx.update.callback_query.data, ';');

      switch (params[0]) {
        case 'set_default_group':
          await api.setDefaultGroup(params[1], params[2]);
          logger.debug('Set default group', { username: params[1], group: params[2] });

          // Update sessions with the new default group
          _.set(sessions, [ctx.from.id, 'defaultGroup'], params[2]);

          ctx.reply(
            `I've succesfully set your default group to *${params[2]}*.`,
            { parse_mode: 'Markdown' },
          );
          break;

        case 'join_group':
          try {
            await api.joinGroup(params[1], params[2]);
            ctx.reply(
              `You are now member of the group *${params[2]}*!`,
              { parse_mode: 'Markdown' },
            );
          } catch (err) {
            if (err.response.status === 400) {
              ctx.reply(
                `It seems that you are already a member in group *${params[2]}*`,
                { parse_mode: 'Markdown' },
              );
            }
          }
          break;
      }
    }

    return ctx.answerCbQuery();
  });

  bot.on('inline_query', (ctx: any) => {
    return ctx.answerInlineQuery([]);
  });
};
