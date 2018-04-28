import { Middleware } from '../types/bot';
import { IncomingMessage } from '../types/telegraf';

const middleware: Middleware = async (ctx) => {
  let msg = 'Hello there! You can start by logging into your account with ' +
    '/login `[username]` `[password]` or you can create a new account with ' +
    '/create `[username]` `[password]` command.';

  if ((ctx.message as IncomingMessage).chat.type !== 'private') {
    msg += ' Either way we should do this in the private chat.';
  }

  ctx.reply(
    msg,
    { parse_mode: 'Markdown' },
  );
};

export default middleware;
