import _ from 'lodash';
import * as api from '../../api';
import { sessions } from '../../middlewares/auth';

export default async (ctx: any) => {
  const username = _.toString(ctx.state.command.splitArgs[0]);
  const password = _.toString(ctx.state.command.splitArgs[1]);

  const user = await api.getUserById(ctx.from.id);
  if (user.authenticated) {
    ctx.reply(
      `You are already logged in as user *${user.username}*.`,
      { parse_mode: 'Markdown' },
    );
    return;
  }

  if (username && password) {
    const res = await api.authenticateUser(username, password);
    if (res.authenticated) {
      await api.saveIdForUser(username, ctx.from.id);
      sessions[ctx.from.id] = username;
      ctx.reply(
        'Wonderful, you\'ve successfully logged in! ' +
        'Now you can use rest of the commands normally.\n\n' +
        '*NOTE*: You should delete the previous message so your password ' +
        'won\'t get into wrong hands.',
        { parse_mode: 'Markdown' },
      );
    } else {
      ctx.reply('Invalid username or password. Try again.');
    }
  } else {
    let msg = 'Please use following format: /login `[username]` `[password]`.';
    if (ctx.message.chat.type !== 'private') {
      msg += ' I\'d prefer to do this in the private chat.';
    }

    ctx.reply(
      msg,
      { parse_mode: 'Markdown' },
    );
  }
};
