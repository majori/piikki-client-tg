const _ = require('lodash');
const Promise = require('bluebird');
const db = require('./database');
const api = require('./api');
const responders = require('./responders');

module.exports = {
  login: (ctx) => {
    if (ctx.session.username) {
      ctx.reply(`Olet jo kirjautunut tunnuksella ${ctx.session.username}`);
    } else {
      // Start the login process
      db.setUserState(ctx.message.from.id, responders.states.loginUsername)
      .then(() => ctx.reply('Syötä tunnus'));
    }
  },


  // Message without any command
  message: (ctx) => {
    // If message is empty or command, ignore it
    if (_.isEmpty(ctx.message.text) || (ctx.message.text[0] === '/')) return;

    // There is no messages to react
    if (!ctx.session.state) return;

    responders.responders[ctx.session.state.type](ctx);
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
          defaultGroup: user.default_group,
          state: JSON.parse(user.json_state),
        };
      })
      .finally(() => next());
    },

    loggedIn: (ctx, next) => {
      if (_.has(ctx, ['session', 'username']) && !_.isNull(ctx.session.username)) {
        next();
      } else {
        ctx.reply('Et ole kirjautunut vielä sisään, voit kirjautua komennolla /kirjaudu');
      }
    },
  },
};
