const _ = require('lodash');
const api = require('./api');
const session = require('./session');

const states = session.constants.states;

// Responders which take login related states
const login = {
  // Takes username and asks for password
  askUsername: async (ctx) => {
    if (ctx.message.text.length < 20) {
      await session.updateSession(ctx.from.id, states.loginAskPassword(ctx.message.text));
      ctx.telegram.sendMessage(ctx.from.id, 'Syötä salasana');
    }
  },

  // Takes password and tries to authenticate the user
  askPassword: async (ctx) => {
    const username = ctx.session.state.payload.username;
    const password = ctx.message.text;

    let res = {};
    try {
      res = await api.authenticateUser(username, password);
    } catch (err) {
      // Request failed or more commonly username doesn't exist
      ctx.telegram.sendMessage(ctx.from.id, 'Väärä tunnus tai salasana, yritä /kirjaudu uudelleen.');
      return;
    }

    if (res.authenticated) {
      await session.linkUser(ctx.message.from.id, username);
      ctx.telegram.sendMessage(ctx.from.id,
        `<b>Kirjauduit onnistuneesti käyttäjällä ${username}!</b> ` +
        'Suosittelen poistamaan äsken lähettämäsi viestin ' +
        'ettei salasanasi joudu vahingossa vääriin käsiin.',
        {
          parse_mode: 'HTML',
        }
      );

      // Set default group if the user has only one
      const user = await api.getUser(username);
      if (_.size(user.saldos) === 1) {
        const groupName = _.chain(user.saldos).keys().first().value();
        await session.setDefaultGroup(ctx.message.from.id, groupName);
      }
    } else {
      // Password was wrong
      ctx.telegram.sendMessage(ctx.from.id, 'Väärä tunnus tai salasana, yritä /kirjaudu uudelleen.');
    }

    await session.resetSession(ctx.message.from.id);
  },
};

const types = session.constants.types;

module.exports = async (ctx) => {
  switch (ctx.session.state.type) {
    case types.LOGIN_ASK_USERNAME:
      login.askUsername(ctx);
      break;

    case types.LOGIN_ASK_PASSWORD:
      login.askPassword(ctx);
      break;

    default:
  }
};
