import _ from 'lodash';
import * as api from '../../api';
import { sessions } from '../../middlewares/auth';
import { Middleware } from '../../types/bot';
import { User, IncomingMessage } from '../../types/telegraf';

const command: Middleware = async (ctx) => {
  const username = _.toString(ctx.state.command.splitArgs[0]);
  const password = _.toString(ctx.state.command.splitArgs[1]);

  const id = (ctx.from as User).id;
  const user = await api.getUserById(id);
  if (user.authenticated) {
    ctx.reply(
      `You can't create a new user, since this Telegram account is already registered to user *${user.username}*.`,
      { parse_mode: 'Markdown' },
    );
    return;
  }

  if (username && password) {
    if (_.size(username) < 3 || _.size(username) > 20) {
      ctx.reply('Username has to be between 3 and 20 characters.');
      return;
    }

    if (_.size(password) < 4) {
      ctx.reply('Password has to be atleast 4 characters.');
      return;
    }

    if (_.size(password) > 255) {
      ctx.reply('Password has to be less than 255 characters.');
      return;
    }

    try {
      await api.createUser(username, password);
      await api.saveIdForUser(username, id);
      sessions[id] = username;

      ctx.reply(
        `You've successfully created a new account called *${username}*. ` +
          'Now you can join groups with command `/join`.\n\n' +
          '*NOTE*: You should delete the previous message so your password ' +
          "won't get into wrong hands.",
        { parse_mode: 'Markdown' },
      );
    } catch (err) {
      if (
        _.includes(_.get(err, 'response.data.error.message'), 'already exists')
      ) {
        ctx.reply(
          `Username *${username}* already exists. Please choose another one.`,
          { parse_mode: 'Markdown' },
        );
      } else if (
        _.includes(_.get(err, 'response.data.error.message'), 'alpha-numeric')
      ) {
        ctx.reply(
          'Username must only contain alpha-numeric and underscore characters. Please choose another one.',
          { parse_mode: 'Markdown' },
        );
      } else {
        throw err;
      }
    }
  } else {
    let msg = 'Please use following format: /create `[username]` `[password]`.';
    if ((ctx.message as IncomingMessage).chat.type !== 'private') {
      msg += "I'd prefer to do this in the private chat.";
    }

    ctx.reply(msg, { parse_mode: 'Markdown' });
  }
};

export default command;
