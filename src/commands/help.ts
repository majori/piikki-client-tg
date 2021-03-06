import { Middleware } from '../types/bot';

const command: Middleware = async (ctx) => {
  ctx.reply(
    '/add `[amount]`\n - Adds saldo to your default group\n' +
      '/sub `[amount]`\n - Subtracts saldo from your default group\n' +
      "/nakki `[amount]`\n - Adds saldo to your default group as 'nakki'\n" +
      '/saldo\n - Lists your saldos in each group\n' +
      '/login `[username]` `[password]`\n- Login to your Piikki account\n' +
      '/create `[username]` `[password]`\n - Create new Piikki account\n' +
      '/setdefault\n - Sets your default group\n' +
      '/join\n - Join to new group\n' +
      '/part\n - Part from a group',
    { parse_mode: 'Markdown' },
  );
};

export default command;
