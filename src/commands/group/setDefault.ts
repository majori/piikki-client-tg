import _ from 'lodash';
import * as api from '../../api';
import { CallbackDataTypeEnum } from '../../constants/callbackEnum';
import { Middleware } from 'types/bot';
import type { IncomingMessage, User } from 'telegraf/typings/telegram-types';

const command: Middleware = async (ctx) => {
  const { username, saldos, defaultGroup } = await api.getUser(
    ctx.state.username,
  );

  if (_.size(saldos) === 1) {
    // User already has a default group
    if (defaultGroup) {
      ctx.reply(
        `Your default group is already set to *${defaultGroup}* and its your only group, you are good to go!`,
        { parse_mode: 'Markdown' },
      );

      // User has only one group, but the default group isn't it
    } else {
      const groupName = _.keys(saldos)[0];
      await api.setDefaultGroup(username, groupName);
      ctx.reply(
        `I've set your default group to *${groupName}*, since its your only group.`,
        { parse_mode: 'Markdown' },
      );
    }
    return;
  }

  const groups = _.chain(saldos)
    .keys()
    .map((group) => ({
      text: group,
      callback_data: _.join([CallbackDataTypeEnum.setDefaultGroup, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply(
      'You are not a member in any group yet. You can join groups with /join',
    );
    return;
  }

  const id = (ctx.from as User).id;
  const message = ctx.message as IncomingMessage;

  if (message.chat.type !== 'private') {
    ctx.reply("Let's continue in the private chat.");
  }

  ctx.telegram.sendMessage(
    id,
    'Pick one of the following groups as a default one',
    {
      reply_markup: {
        inline_keyboard: _.chunk(groups, 2),
      },
    },
  );
};

export default command;
