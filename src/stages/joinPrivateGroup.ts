import _ from 'lodash';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';
import { CallbackQuery, Context, SceneObject } from 'types/bot';
import { IncomingMessage } from 'types/telegraf';
import Scene from 'telegraf/scenes/base';
import { Scene as TelegrafScene } from 'types/bot';

const act = new Scene('joinPrivateGroup') as TelegrafScene;

act.enter((ctx: Context) => {
  const callbackQuery = ctx.callbackQuery as CallbackQuery;
  const group = callbackQuery.params[0];

  const scene = ctx.scene as SceneObject;
  scene.state.group = group;
  scene.state.attemps = 1;

  ctx.reply(
    `Please send the password of the group *${group}*.`,
    { parse_mode: 'Markdown' },
  );

  return ctx.answerCbQuery();
});

act.on('message', async (ctx: Context) => {
  const { username, saldos } = await api.getUser(ctx.state.username);
  const scene = ctx.scene as SceneObject;
  const message = ctx.message as IncomingMessage;

  const { group, attemps } = scene.state;
  const password = message.text || '';
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
    scene.state.attemps = attemps + 1;

    switch (attemps) {
      case 1:
        return ctx.reply('Wrong password! Try again.');

      case 2:
        return ctx.reply('Wrong again! Try once more.');

      default:
        ctx.reply('Still not correct! Use /join if you really want to join this group.');
        break;
    }
  }

  scene.leave();
});

export default act;
