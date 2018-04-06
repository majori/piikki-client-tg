import _ from 'lodash';
import * as api from '../api';

export const setDefault = async (ctx: any) => {
  const { saldos } = await api.getUser(ctx.state.username);
  const groups = _.chain(saldos)
    .keys()
    .map((group) => ({
      text: group,
      callback_data: _.join(['set_default_group', ctx.state.username, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    return ctx.reply('You are not a member in any group yet.');
  }

  ctx.reply('Pick one of the following groups as a default one', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};

export const joinGroup = (ctx: any) => {};
