import * as transaction from './transaction';
import saldo from './saldo';
import login from './login';
import * as group from './group';

export default (bot: any) => {
  bot.command('/start', (ctx: any) => {
    ctx.reply(
      'Hello there! You can start by logging into your account with ' +
      '`/login username password` command.',
      { parse_mode: 'Markdown' },
    );
  });

  bot.command('/sub', transaction.subtract);
  bot.command('/add', transaction.add);
  bot.command('/nakki', transaction.effort);

  bot.command('/saldo', saldo);
  bot.command('/login', login);
  bot.command('/setdefault', group.setDefault);
};
