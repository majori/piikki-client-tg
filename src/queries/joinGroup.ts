import _ from 'lodash';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';
import Logger from '../logger';
import type { Context } from 'types/bot';

const logger = new Logger(__filename);

const queryHandler = async (ctx: Context, group: string) => {
  const callbackQuery = ctx.callbackQuery!;

  const { username, saldos } = await api.getUser(ctx.state.username);
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
    ctx.deleteMessage(callbackQuery.message!.message_id);
  } catch (err) {
    if ((err as any).response.status === 400) {
      ctx.reply(`It seems that you are already a member in group *${group}*`, {
        parse_mode: 'Markdown',
      });
    }
  }

  return ctx.answerCbQuery();
};

export default queryHandler;
