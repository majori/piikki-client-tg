import _ from 'lodash';
import * as api from '../api';

const makeTransaction = async (ctx: any, positive: boolean, comment?: string) => {
  const user = await api.getUser(ctx.state.username);

  if (!user.defaultGroup) {
    return ctx.reply(
      'It seems that you haven\'t any of your groups set as default group. ' +
      'You can do it with the `/setdefault` command.',
      { parse_mode: 'Markdown' },
    );
  }
  const amount = _.toNumber(ctx.state.command.splitArgs[0] || 1);
  if (amount) {
    const res = await api.makeTransaction(
      user.username,
      user.defaultGroup,
      positive ? amount : -amount,
      comment,
    );
    ctx.reply(
      `Your new saldo in group *${user.defaultGroup}* is *${res.saldo}*`,
      { parse_mode: 'Markdown' },
    );
  } else {
    ctx.reply('The amount wasn\'t a number.');
  }
};

export const add = _.partial(makeTransaction, _, true);
export const subtract = _.partial(makeTransaction, _, false);
export const effort = _.partial(makeTransaction, _, true, 'effort');
