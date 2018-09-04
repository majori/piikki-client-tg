import * as transaction from './transaction';
import saldo from './saldo';
import start from './start';
import help from './help';
import user from './user';
import group from './group';
import { Telegraf } from '../types/telegraf';

export default (bot: Telegraf) => {
  bot.telegram.getMe().then((info) => {
    bot.options.username = info.username;
  });

  bot.start(start);
  bot.help(help);

  bot.hears(/^(\+|\-)[[\d.]+$/, transaction.fromText);

  bot.command('/sub', transaction.commands.subtract);
  bot.command('/add', transaction.commands.add);
  bot.command('/nakki', transaction.commands.effort);
  bot.command('/saldo', saldo);

  bot.command('/create', user.create);
  bot.command('/login', user.login);

  bot.command('/setdefault', group.setDefault);
  bot.command('/join', group.joinGroup);
  bot.command('/part', group.partGroup);
};
