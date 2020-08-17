import _ from 'lodash';
import * as api from '../../api';
import { CallbackDataTypeEnum } from '../../constants/callbackEnum';
import { Middleware } from 'types/bot';
import { IncomingMessage, User } from 'types/telegraf';

const command: Middleware = async (ctx) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const available = _.map(await api.getGroups(), (group: Group) =>
    _.pick(group, ['name', 'private']),
  );
  const old = _.keys(saldos).map((group) => ({ name: group }));

  const groups = _.chain(available)
    .differenceBy(old, 'name')
    .map((group) => ({
      text: (group.private ? '🔒 ' : '') + group.name,
      callback_data: _.join(
        [
          group.private
            ? CallbackDataTypeEnum.joinPrivateGroup
            : CallbackDataTypeEnum.joinGroup,
          group.name,
        ],
        ';',
      ),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply(
      'It seems that you are already a member in every possible group!',
    );
    return;
  }

  const id = (ctx.from as User).id;
  const message = ctx.message as IncomingMessage;

  if (message.chat.type !== 'private') {
    ctx.reply("Let's continue in the private chat.");
  }
  ctx.telegram.sendMessage(id, 'Join one of the following groups', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};

export default command;
