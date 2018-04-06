import * as transaction from './transaction';
import saldo from './saldo';
import login from './login';
import * as group from './group';

export default (bot: any) => {
  bot.command('/sub', transaction.subtract);
  bot.command('/add', transaction.add);
  bot.command('/nakki', transaction.effort);

  bot.command('/saldo', saldo);
  bot.command('/login', login);
  bot.command('/setdefault', group.setDefault);
};
