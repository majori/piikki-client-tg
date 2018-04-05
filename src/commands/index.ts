import * as api from '../api';

export default (bot: any) => {
  bot.command('/viiva', (ctx) => ctx.reply('Hello'));
  bot.command('/lisaa', ({ reply }) => reply('Yo'));
  bot.command('/saldo', async (ctx) => {
    const user = await api.getUser('user1');
    ctx.reply(user.saldos);
  });
};
