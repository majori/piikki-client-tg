import _ from 'lodash';
import { sessions } from '../middlewares/auth';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default (bot: any) => {
  bot.on('callback_query', async (ctx: any) => {
    logger.debug('Callback Query', ctx.callbackQuery);

    if (ctx.callbackQuery.data) {
      const { username, saldos, defaultGroup } = await api.getUser(ctx.state.username);
      const query = _.split(ctx.callbackQuery.data, ';');
      const command = _.first(query);
      const params = _.tail(query);

      switch (command) {
        case CallbackDataTypeEnum.setDefaultGroup:
          await api.setDefaultGroup(username, params[0]);
          logger.debug('Set default group', { username, group: params[0] });

          ctx.reply(
            `I've succesfully set your default group to *${params[0]}*.`,
            { parse_mode: 'Markdown' },
          );
          ctx.deleteMessage(ctx.callbackQuery.message.message_id);
          break;

        case CallbackDataTypeEnum.joinGroup:
          try {
            const isFirstGroup = _.isEmpty(saldos);
            await api.joinGroup(username, params[0]);
            ctx.reply(
              `You are now member of the group *${params[0]}*!`,
              { parse_mode: 'Markdown',
                reply_markup: (isFirstGroup) ? undefined : {
                  inline_keyboard: [[
                    {
                      text: 'Set this group as default',
                      callback_data: _.join([CallbackDataTypeEnum.setDefaultGroup, params[0]], ';'),
                    },
                    {
                      text: 'Keep the current default group',
                      callback_data: _.join([CallbackDataTypeEnum.keepDefaultGroup, params[0]], ';'),
                    },
                  ]],
                },
              },
            );
            ctx.deleteMessage(ctx.callbackQuery.message.message_id);
          } catch (err) {
            if (err.response.status === 400) {
              ctx.reply(
                `It seems that you are already a member in group *${params[0]}*`,
                { parse_mode: 'Markdown' },
              );
            }
          }
          break;

        case CallbackDataTypeEnum.partGroup:
          const saldo = Number(saldos[params[0]]);

          if (saldo !== 0) {
            ctx.reply(
              `You can only part from groups where your saldo is 0, ` +
              `your current saldo in *${params[0]}* is *${saldo}*!`,
              { parse_mode: 'Markdown' },
            );
            return;
          }

          await api.partGroup(username, params[0]);
          ctx.reply(
            `You have parted from the group *${params[0]}*!`,
            { parse_mode: 'Markdown' },
          );
          ctx.deleteMessage(ctx.callbackQuery.message.message_id);

          break;

        case CallbackDataTypeEnum.keepDefaultGroup:

          const reply = defaultGroup ?
            `You are now member of the group *${params[0]}*, ` +
            `but your default group is still *${defaultGroup}*!`
          :
            `You are now member of the group *${params[0]}*, ` +
            `but you don\'t have a default group. You can set ` +
            `it with /setdefault command.`;

          ctx.reply(reply, { parse_mode: 'Markdown' });
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
