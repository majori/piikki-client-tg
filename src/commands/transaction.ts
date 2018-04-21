import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

const makeTransaction = async (ctx: any, positive: boolean, comment?: string) => {
  const user = await api.getUser(ctx.state.username);

  if (!user.defaultGroup) {
    ctx.reply(
      'It seems that you haven\'t any of your groups set as default group. ' +
      'You can do it with the `/setdefault` command.',
      { parse_mode: 'Markdown' },
    );
    return;
  }

  let rawAmount = _.get(ctx, 'state.command.splitArgs[0]');
  if (_.isEmpty(rawAmount)) {
    rawAmount = '1';
  }

  let amount = _.chain(rawAmount)
    .replace(',', '.')
    .toNumber()
    .round(2)
    .value();

  if (Math.abs(amount) >= 1e+6) {
    ctx.reply('The amount has to be less than one million.');
    return;
  }

  if (amount === 0) {
    ctx.reply('The amount can\'t be zero.');
    return;
  }

  amount = positive ? amount : -amount;

  if (amount) {
    const res = await api.makeTransaction(
      user.username,
      user.defaultGroup,
      amount,
      comment,
    );

    logger.debug('Transaction', { username: user.username, group: user.defaultGroup, amount });
    ctx.reply(
      `Your new saldo in group *${user.defaultGroup}* is *${res.saldo}*.`,
      {
        parse_mode: 'Markdown',
        reply_markup: (ctx.message.chat.type === 'private') ? {
          keyboard: [[{ text: '-1'}, { text: '+1' }]],
          resize_keyboard: true,
        } : undefined,
      },
    );
  } else {
    ctx.reply('The amount wasn\'t a number.');
  }
};

export const add = _.partial(makeTransaction, _, true);
export const subtract = _.partial(makeTransaction, _, false);
export const effort = _.partial(makeTransaction, _, true, 'effort');
