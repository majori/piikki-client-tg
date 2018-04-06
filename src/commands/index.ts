import _ from 'lodash';
import * as api from '../api';
import * as transaction from './transaction';

export default (bot: any) => {
  bot.command('/sub', transaction.subtract);
  bot.command('/add', transaction.add);

  bot.command('/saldo', async (ctx: any) => {
    const user = await api.getUser(ctx.state.username);

    if (_.isEmpty(user.saldos)) {
      ctx.reply('You are not a member in any group.');
    }

    ctx.reply(
      _.map(user.saldos, (saldo, group) => `*${group}*: ${saldo}`).join('\n'),
      { parse_mode: 'Markdown' },
    );
  });
};
