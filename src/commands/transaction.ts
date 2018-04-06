import _ from 'lodash';
import * as api from '../api';

const makeTransaction = async (ctx: any, positive: boolean, comment?: string) => {
  if (!ctx.state.defaultGroup) {
    return ctx.reply('No default group');
  }
  const amount = _.toNumber(ctx.state.command.splitArgs[0] || 1);
  if (amount) {
    const res = await api.makeTransaction(
      ctx.state.username,
      ctx.state.defaultGroup,
      positive ? amount : -amount,
      comment,
    );
    ctx.reply(res);
  } else {
    ctx.reply('Not a number.');
  }
};

export const add = _.partial(makeTransaction, _, true);
export const subtract = _.partial(makeTransaction, _, false);
export const effort = _.partial(makeTransaction, _, true, 'effort');
