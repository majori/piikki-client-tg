import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

interface TransactionOptions {
  amount: (ctx: any) => number | null;
  comment?: string;
}

const makeTransaction = async (ctx: any, options: TransactionOptions) => {
  const user = await api.getUser(ctx.state.username);

  if (!user.defaultGroup) {
    ctx.reply(
      'It seems that you haven\'t any of your groups set as default group. ' +
      'You can do it with the /setdefault command.',
      { parse_mode: 'Markdown' },
    );
    return;
  }

  const amount = options.amount(ctx);

  if (amount) {
    if (Math.abs(amount) >= 1e+6) {
      ctx.reply('The amount has to be less than one million.');
      return;
    }

    if (amount === 0) {
      ctx.reply('The amount can\'t be zero.');
      return;
    }

    const res = await api.makeTransaction(
      user.username,
      user.defaultGroup,
      amount,
      options.comment,
    );

    logger.debug('Transaction', { username: user.username, group: user.defaultGroup, amount });
    ctx.reply(
      `Your new saldo in group *${user.defaultGroup}* is *${res.saldo}*.`,
      {
        parse_mode: 'Markdown',
        reply_markup: (ctx.message.chat.type === 'private') ? {
          keyboard: [[{ text: '-5'}, { text: '-2' }, { text: '-1'}]],
          resize_keyboard: true,
        } : undefined,
      },
    );
  } else {
    ctx.reply('The amount wasn\'t a number.');
  }
};

const amountFromCommandParam = (positive: boolean) => (ctx: any) => {
  let rawAmount = _.get(ctx, 'state.command.splitArgs[0]');

  // If amount was a empty string, default to 1
  if (_.isEmpty(rawAmount)) {
    rawAmount = '1';
  }

  return _.chain(rawAmount)
    .replace(',', '.')
    .toNumber()
    .round(2)
    .multiply(positive ? 1 : -1)
    .value();
};

const amountFromText = (ctx: any) => {
  const sign = ctx.message.text.slice(0, 1);
  const amount = _.toNumber(ctx.message.text.slice(1));

  return sign === '+' ? amount : -amount;
};

export const command = {
  add: (ctx: any) => makeTransaction(ctx, { amount: amountFromCommandParam(true) }),
  subtract: (ctx: any) => makeTransaction(ctx, { amount: amountFromCommandParam(false) }),
  effort: (ctx: any) => makeTransaction(ctx, { amount: amountFromCommandParam(true), comment: 'effort'}),
};

export const fromText = (ctx: any) => makeTransaction(ctx, { amount: amountFromText });
