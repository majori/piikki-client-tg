import _ from 'lodash';
import * as api from '../api';

export const setDefault = async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);
  const groups = _.chain(saldos)
    .keys()
    .map((group) => ({
      text: group,
      callback_data: _.join(['set_default_group', username, group], ';'),
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

export const joinGroup = async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const available = _.map(await api.getGroups(), 'name');
  const old = _.keys(saldos);

  const groups = _.chain(available)
    .difference(old)
    .map((group) => ({
      text: group,
      callback_data: _.join(['join_group', username, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    return ctx.reply('It seems that you are already a member in every possible group!');
  }

  ctx.reply('Join one of the following groups', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};
