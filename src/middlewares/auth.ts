import _ from 'lodash';
import * as api from '../api';

export const sessions: { [id: string]: string } = {};

export default async (ctx: any, next: any) => {
  if (_.includes(['start', 'help', 'login', 'create'], _.get(ctx, 'state.command.command'))) {
    return next();
  }

  if (sessions[ctx.from.id]) {
    ctx.state.username = sessions[ctx.from.id];
    return next();

  // User isn't authenticated yet
  } else {
    const res = await api.getUserById(ctx.from.id);
    if (res.authenticated) {
      const user = await api.getUser(res.username);

      sessions[ctx.from.id] = user.username;
      ctx.state.username = user.username;

      return next();
    } else {
      const msg = 'Hey! It seems you are not logged in yet. ' +
        `${(ctx.message.chat.type !== 'private') ?
          'Send me in the private chat' :
          'Try to login with'
        } /login \`[username]\` \`[password]\` ` +
        'or create a new account with /create `[username]` `[password]`';
      ctx.reply(
        msg,
        { parse_mode: 'Markdown' },
      );
    }
  }
};
