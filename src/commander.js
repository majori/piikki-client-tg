const _ = require('lodash');
const Promise = require('bluebird');
const db = require('./database');
const api = require('./api');

const sessionCommands = {
  LOGIN_USERNAME: (ctx) => {
    const state = ctx.session.state;
    if (ctx.message.text.length < 20) {
      db.setUserState(ctx.message.from.id, {
        type: 'LOGIN_PASSWORD',
        payload: {
          username: ctx.message.text,
        },
      })
      .then(() => ctx.reply('Syötä salasana'));
    }
  },

  LOGIN_PASSWORD: (ctx) => {
    const username = ctx.session.state.payload.username;
    const password = ctx.message.text;

    api.authenticateUser(username, password)
    .then((res) => {
      if (res.authenticated) {
        db.linkUser(ctx.message.from.id, username)
        .then(() => {
          ctx.reply('Kirjauduit onnistuneesti!');
        });
      } else {
        ctx.reply('Väärä tunnus tai salasana, yritä uudelleen');
      }
    })
    .catch(() => ctx.reply('Tapahtui virhe, yritä kirjautumista uudelleen'))
    .finally(() => db.setUserState(ctx.message.from.id, null));
  },
};

module.exports = {
  login: (ctx) => {
    if (ctx.session.username) {
      ctx.reply(`Olet jo kirjautunut tunnuksella ${ctx.session.username}`);
    } else {
      db.setUserState(ctx.message.from.id, {
        type: 'LOGIN_USERNAME',
      })
      .then(() => ctx.reply('Syötä tunnus'));
    }
  },

  message: (ctx) => {
    // If message is empty or command, ignore it
    if (_.isEmpty(ctx.message.text) || (ctx.message.text[0] === '/')) return;

    // There is no messages to react
    if (!ctx.session.state) return;

    sessionCommands[ctx.session.state.type](ctx);
  },

  middleware: {
    getSession: (ctx, next) => {
      db.getUser(ctx.message.from.id)
      .then(user => (user
        ? Promise.resolve(user)
        : db.createUser(ctx.message.from.id)
            .then(() => db.getUser(ctx.message.from.id))
      ))
      .then((user) => {
        ctx.session = {
          username: user.piikki_username,
          state: JSON.parse(user.json_state),
        };
      })
      .finally(() => next());
    },
  },
};
