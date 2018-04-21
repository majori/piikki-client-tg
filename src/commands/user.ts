import _ from 'lodash';
import * as api from '../api';
import { sessions } from '../middlewares/auth';

export const create = async (ctx: any) => {
  const username = _.toString(ctx.state.command.splitArgs[0]);
  const password = _.toString(ctx.state.command.splitArgs[1]);

  const user = await api.getUserById(ctx.from.id);
  if (user.authenticated) {
    ctx.reply(
      `You can't create a new user, since this Telegram account is already registered to user *${user.username}*.`,
      { parse_mode: 'Markdown' },
    );
    return;
  }

  if (username && password) {
    if (_.size(username) <= 2) {
      ctx.reply('Username has to have atleast 3 characters.');
      return;
    }

    try {
      await api.createUser(username, password);
      await api.saveIdForUser(username, ctx.from.id);
      sessions[ctx.from.id] = username;
      ctx.reply(
        `You've successfully created a new account called *${username}*. ` +
        'Now you can join groups with command `/join`.',
        { parse_mode: 'Markdown' },
      );

    } catch (err) {
      if (err.response.data.error.message === `Username ${username} already exists`) {
        ctx.reply(
          `Username *${username}* already exists. Choose another one.`,
          { parse_mode: 'Markdown' },
        );
      } else {
        throw err;
      }
    }
  } else {
    ctx.reply(
      'Please use following format: `/create [username] [password]`',
      { parse_mode: 'Markdown' },
    );
  }
};

export const login = async (ctx: any) => {
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
    ctx.reply(
      'Please use following format: /login `[username]` `[password]`',
      { parse_mode: 'Markdown' },
    );
  }
};

export default {
  create,
  login,
};
