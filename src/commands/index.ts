import * as transaction from './transaction';
import saldo from './saldo';
import start from './start';
import help from './help';
import * as user from './user';
import * as group from './group';

export default (bot: any) => {
  bot.telegram.getMe().then((info: any) => {
    bot.options.username = info.username;
  });

  bot.start(start);
  bot.help(help);

  bot.hears('-1', transaction.subtract);
  bot.hears('+1', transaction.add);

  bot.command('/sub', transaction.subtract);
  bot.command('/add', transaction.add);
  bot.command('/nakki', transaction.effort);
  bot.command('/saldo', saldo);

  bot.command('/create', user.create);
  bot.command('/login', user.login);

  bot.command('/setdefault', group.setDefault);
  bot.command('/join', group.joinGroup);
};
