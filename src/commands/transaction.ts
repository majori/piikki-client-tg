import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import type { Context, Middleware } from '../types/bot';
import type { IncomingMessage } from 'telegraf/typings/telegram-types';

const logger = new Logger(__filename);

interface TransactionOptions {
  amount: (ctx: any) => number | null;
  comment?: string;
}

const makeTransaction = async (ctx: Context, options: TransactionOptions) => {
  const user = await api.getUser(ctx.state.username);

  if (!user.defaultGroup) {
    ctx.reply(
      "It seems that you haven't any of your groups set as default group. " +
        'You can do it with the /setdefault command.',
      { parse_mode: 'Markdown' },
    );
    return;
  }

  const amount = options.amount(ctx);

  if (amount) {
    if (Math.abs(amount) >= 1e6) {
      ctx.reply('The amount has to be less than one million.');
      return;
    }

    if (amount === 0) {
      ctx.reply("The amount can't be zero.");
      return;
    }

    const res = await api.makeTransaction(
      user.username,
      user.defaultGroup,
      amount,
      options.comment,
    );

    logger.debug('Transaction', {
      username: user.username,
      group: user.defaultGroup,
      amount,
    });
    ctx.reply(
      `Your new saldo in group *${user.defaultGroup}* is *${res.saldo}*.`,
      {
        parse_mode: 'Markdown',
        reply_markup:
          (ctx.message as IncomingMessage).chat.type === 'private'
            ? {
                keyboard: [[{ text: '-5' }, { text: '-2' }, { text: '-1' }]],
                resize_keyboard: true,
              }
            : undefined,
      },
    );
  } else {
    ctx.reply("The amount wasn't a number.");
  }
};

const amountFromCommandParam = (positive: boolean) => (ctx: Context) => {
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

const amountFromText = (ctx: Context) => {
  const text = (ctx.message as IncomingMessage).text as string;
  const sign = text.slice(0, 1);
  const amount = _.toNumber(text.slice(1));

  return sign === '+' ? amount : -amount;
};

export const commands: { [key: string]: Middleware } = {
  add: (ctx) => makeTransaction(ctx, { amount: amountFromCommandParam(true) }),
  subtract: (ctx) =>
    makeTransaction(ctx, { amount: amountFromCommandParam(false) }),
  effort: (ctx) =>
    makeTransaction(ctx, {
      amount: amountFromCommandParam(true),
      comment: 'effort',
    }),
};

export const fromText: Middleware = (ctx) =>
  makeTransaction(ctx, { amount: amountFromText });
