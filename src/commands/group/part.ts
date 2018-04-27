import _ from 'lodash';
import * as api from '../../api';
import { CallbackDataTypeEnum } from '../../constants/callbackEnum';

export default async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const groupNames = _.keys(saldos);

  const groups = _.chain(groupNames)
    .map((group) => ({
      text: group,
      callback_data: _.join([CallbackDataTypeEnum.partGroup, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply('It seems that you aren\'t a member of any group!');
    return;
  }

  ctx.telegram.sendMessage(ctx.message.from.id, 'Choose the group you wish to part', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};
