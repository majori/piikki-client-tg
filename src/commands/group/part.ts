import _ from 'lodash';
import * as api from '../../api';
import { CallbackDataTypeEnum } from '../../constants/callbackEnum';
import { Middleware } from 'types/bot';
import { User } from 'types/telegraf';

const command: Middleware = async (ctx) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const groupNames = _.keys(saldos);

  const groups = _.chain(groupNames)
    .map((group) => ({
      text: group,
      callback_data: _.join([CallbackDataTypeEnum.partGroup, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply("It seems that you aren't a member of any group!");
    return;
  }

  const id = (ctx.from as User).id;

  ctx.telegram.sendMessage(id, 'Choose the group you wish to part', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};

export default command;
