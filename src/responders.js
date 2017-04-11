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
  async loginUsername(ctx) {
    if (ctx.message.text.length < 20) {
      await db.setUserState(ctx.message.from.id, states.loginPassword(ctx.message.text));
      ctx.reply('Syötä salasana');
    }
  },

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
      ctx.reply('Kirjauduit onnistuneesti!');
    } else {
      ctx.reply('Väärä tunnus tai salasana, yritä uudelleen');
    }

    await db.setUserState(ctx.message.from.id, null);
  },
};

module.exports = { states, responders };
