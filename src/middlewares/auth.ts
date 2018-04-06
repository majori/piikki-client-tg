import _ from 'lodash';
import * as api from '../api';

const sessions: { [id: string]: User } = {};

export default async (ctx: any, next: Function) => {
  if (sessions[ctx.from.id]) {
    _.assign(ctx.state, sessions[ctx.from.id]);
    return next();

  // User isn't authenticated yet
  } else {
    const res = await api.getUserById(ctx.from.id);
    if (res.authenticated) {
      sessions[ctx.from.id] = await api.getUser(res.username);
      _.assign(ctx.state, sessions[ctx.from.id]);
      return next();
    } else {
      ctx.reply('Hey! It seems you are not logged in yet.');
    }
  }
};
