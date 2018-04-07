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

  bot.command('/help', (ctx: any) => {
    ctx.reply(
      '/add `[amount]`\n - Adds saldo to your default group\n' +
      '/sub `[amount]`\n - Subtracts saldo from your default group\n' +
      '/nakki `[amount]`\n - Adds saldo to your default group as \'nakki\'\n' +
      '/saldo\n - Lists your saldos in each group\n' +
      '/login\n - Login to your Piikki account\n' +
      '/setdefault\n - Sets your default group',
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
