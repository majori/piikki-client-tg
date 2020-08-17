import _ from 'lodash';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';
import Logger from '../logger';
import { Middleware, CallbackQuery } from 'types/bot';
import { IncomingMessage } from 'types/telegraf';

const logger = new Logger(__filename);

const queryHandler: Middleware = async (ctx) => {
  const callbackQuery = ctx.callbackQuery as CallbackQuery;

  const { username, saldos } = await api.getUser(ctx.state.username);
  const group = callbackQuery.params[0];
  const isFirstGroup = _.isEmpty(saldos);

  try {
    await api.joinGroup(username, group);
    ctx.reply(`You are now member of the group *${group}*!`, {
      parse_mode: 'Markdown',
      reply_markup: isFirstGroup
        ? undefined
        : {
            inline_keyboard: [
              [
                {
                  text: 'Set this group as default',
                  callback_data: _.join(
                    [CallbackDataTypeEnum.setDefaultGroup, group],
                    ';',
                  ),
                },
              ],
              [
                {
                  text: 'Keep the current default group',
                  callback_data: _.join(
                    [CallbackDataTypeEnum.keepDefaultGroup, group],
                    ';',
                  ),
                },
              ],
            ],
          },
    });
    ctx.deleteMessage((callbackQuery.message as IncomingMessage).message_id);
  } catch (err) {
    if (err.response.status === 400) {
      ctx.reply(`It seems that you are already a member in group *${group}*`, {
        parse_mode: 'Markdown',
      });
    }
  }

  return ctx.answerCbQuery();
};

export default queryHandler;
