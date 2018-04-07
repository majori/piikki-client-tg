import _ from 'lodash';
import * as api from '../api';

export const sessions: { [id: string]: string } = {};

export default async (ctx: any, next: any) => {
  if (!ctx.state.command || ctx.state.command.command === 'login') {
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
      ctx.reply(
        'Hey! It seems you are not logged in yet. ' +
        'Try to login with `/login username password`',
        { parse_mode: 'Markdown' },
      );
    }
  }
};
