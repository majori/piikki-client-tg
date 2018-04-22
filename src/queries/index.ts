import _ from 'lodash';
import { sessions } from '../middlewares/auth';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default (bot: any) => {
  bot.on('callback_query', async (ctx: any) => {
    logger.debug('Callback Query', ctx.callbackQuery);
    if (ctx.callbackQuery.data) {
      const params = _.split(ctx.callbackQuery.data, ';');

      switch (params[0]) {
        case 'set_default_group':
          await api.setDefaultGroup(params[1], params[2]);
          logger.debug('Set default group', { username: params[1], group: params[2] });

          ctx.reply(
            `I've succesfully set your default group to *${params[2]}*.`,
            { parse_mode: 'Markdown' },
          );
          ctx.deleteMessage(ctx.callbackQuery.message.message_id);
          break;

        case 'join_group':
          try {
            await api.joinGroup(params[1], params[2]);
            ctx.reply(
              `You are now member of the group *${params[2]}*!`,
              { parse_mode: 'Markdown' },
            );
            ctx.deleteMessage(ctx.callbackQuery.message.message_id);
          } catch (err) {
            if (err.response.status === 400) {
              ctx.reply(
                `It seems that you are already a member in group *${params[2]}*`,
                { parse_mode: 'Markdown' },
              );
            }
          }
          break;

        case 'part_group':
          const { username, saldos } = await api.getUser(ctx.state.username);
          const saldo = Number(saldos[params[2]]);

          if (saldo !== 0) {
            ctx.reply(
              `You can only part from groups where your saldo is 0,`
                + ` your current saldo in *${params[2]}* is *${saldo}*!`,
              { parse_mode: 'Markdown' },
            );
            return;
          }

          await api.partGroup(params[1], params[2]);
          ctx.reply(
            `You have parted from the group *${params[2]}*!`,
            { parse_mode: 'Markdown' },
          );
          ctx.deleteMessage(ctx.callbackQuery.message.message_id);

          break;
      }
    }

    return ctx.answerCbQuery();
  });

  bot.on('inline_query', (ctx: any) => {
    return ctx.answerInlineQuery([]);
  });
};
