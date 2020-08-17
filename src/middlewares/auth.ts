import _ from 'lodash';
import * as api from '../api';
import { Middleware } from 'types/bot';
import { IncomingMessage } from 'types/telegraf';

export const sessions: { [id: string]: string } = {};

const middleware: Middleware = async (ctx, next: any) => {
  if (
    _.includes(
      ['start', 'help', 'login', 'create'],
      _.get(ctx, 'state.command.command'),
    )
  ) {
    return next();
  }

  const id = _.get(ctx, 'from.id');

  if (sessions[id]) {
    ctx.state.username = sessions[id];
    return next();

    // User isn't authenticated yet
  } else {
    const res = await api.getUserById(id);
    if (res.authenticated) {
      const user = await api.getUser(res.username);

      sessions[id] = user.username;
      ctx.state.username = user.username;

      return next();
    } else {
      const msg =
        'Hey! It seems you are not logged in yet. ' +
        `${
          (ctx.message as IncomingMessage).chat.type !== 'private'
            ? 'Send me in the private chat'
            : 'Try to login with'
        } /login \`[username]\` \`[password]\` ` +
        'or create a new account with /create `[username]` `[password]`';
      ctx.reply(msg, { parse_mode: 'Markdown' });
    }
  }
};

export default middleware;
