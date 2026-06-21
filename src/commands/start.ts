import type { Middleware } from '../types/bot';

const command: Middleware = async (ctx) => {
  let msg =
    'Hello there! You can start by logging into your account with ' +
    '/login `[username]` `[password]` or you can create a new account with ' +
    '/create `[username]` `[password]` command.';

  if (ctx.chat?.type !== 'private') {
    msg += ' Either way we should do this in the private chat.';
  }

  ctx.reply(msg, { parse_mode: 'Markdown' });
};

export default command;
