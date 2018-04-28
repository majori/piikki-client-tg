import _ from 'lodash';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';
import { CallbackQuery } from 'types/bot';
import Scene from 'telegraf/scenes/base';

export default () => {

  let group: string;

  const act = new Scene('joinPrivateGroup');

  act.enter((ctx: any) => {
    const callbackQuery = ctx.callbackQuery as CallbackQuery;
    group = callbackQuery.params[0];
    ctx.reply(
      `Please send the password of the group *${group}*.`,
      { parse_mode: 'Markdown' },
    );
    return ctx.answerCbQuery();
  });

  act.on('message', async (ctx: any) => {
    const { username, saldos } = await api.getUser(ctx.state.username);
    const password = ctx.message.text;
    const isFirstGroup = _.isEmpty(saldos);
    try {
      await api.joinPrivateGroup(username, password, group);
      ctx.reply(
        `You are now member of the group *${group}*!`,
        { parse_mode: 'Markdown',
          reply_markup: isFirstGroup ? undefined : {
            inline_keyboard: [
              [{
                text: 'Set this group as default',
                callback_data: _.join([CallbackDataTypeEnum.setDefaultGroup, group], ';'),
              }],
              [{
                text: 'Keep the current default group',
                callback_data: _.join([CallbackDataTypeEnum.keepDefaultGroup, group], ';'),
              }],
            ],
          },
        },
      );
    } catch (err) {
      ctx.reply('Wrong password!');
    }

    ctx.scene.leave();
  });

  return act;

};
