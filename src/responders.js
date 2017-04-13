const _ = require('lodash');
const db = require('./database');
const api = require('./api');

const states = {
  loginPassword: username => ({
    type: 'loginPassword',
    payload: {
      username,
    },
  }),

  loginUsername: () => ({
    type: 'loginUsername',
  }),
};

const responders = {

  // Takes username and asks for password
  async loginUsername(ctx) {
    if (ctx.message.text.length < 20) {
      await db.setUserState(ctx.message.from.id, states.loginPassword(ctx.message.text));
      ctx.reply('Syötä salasana');
    }
  },

  // Takes password and tries to authenticate the user
  async loginPassword(ctx) {
    const username = ctx.session.state.payload.username;
    const password = ctx.message.text;

    let res = {};
    try {
      res = await api.authenticateUser(username, password);
    } catch (err) {
      ctx.reply('Tapahtui virhe, yritä kirjautumista uudelleen');
      return;
    }

    if (res.authenticated) {
      await db.linkUser(ctx.message.from.id, username);
      ctx.reply(`Kirjauduit onnistuneesti käyttäjällä ${username}!`);

      // Set default group if the user has only one
      const user = await api.getUser(username);
      if (_.size(user.saldos) === 1) {
        const groupName = _.chain(user.saldos).keys().first().value();
        await db.setDefaultGroup(ctx.message.from.id, groupName);
      }
    } else {
      ctx.reply('Väärä tunnus tai salasana, yritä /kirjaudu uudelleen.');
    }

    await db.setUserState(ctx.message.from.id, null);
  },
};

module.exports = { states, responders };
