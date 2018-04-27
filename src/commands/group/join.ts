import _ from 'lodash';
import * as api from '../../api';
import { CallbackDataTypeEnum } from '../../constants/callbackEnum';

export default async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const available = _.map(await api.getGroups(), (group: Group) => _.pick(group, ['name', 'private']));
  const old = _.keys(saldos).map((group) => ({ name: group }));

  const groups = _.chain(available)
    .differenceBy(old, 'name')
    .map((group) => ({
      text: (group.private ? '🔒 ' : '') + group.name,
      callback_data: _.join([
        group.private ? CallbackDataTypeEnum.joinPrivateGroup : CallbackDataTypeEnum.joinGroup,
        group.name,
      ], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply('It seems that you are already a member in every possible group!');
    return;
  }

  if (ctx.message.chat.type !== 'private') {
    ctx.reply('Let\'s continue in the private chat.');
  }
  ctx.telegram.sendMessage(ctx.message.from.id, 'Join one of the following groups', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};
