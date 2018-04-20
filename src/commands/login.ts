import _ from 'lodash';
import * as api from '../api';

export default async (ctx: any) => {
  const username = _.toString(ctx.state.command.splitArgs[0]);
  const password = _.toString(ctx.state.command.splitArgs[1]);

  if (username && password) {
    const res = await api.authenticateUser(username, password);
    if (res.authenticated) {
      await api.saveIdForUser(username, ctx.from.id);
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
    ctx.reply(
      'Please use following format: /login `[username]` `[password]`',
      { parse_mode: 'Markdown' },
    );
  }
};
