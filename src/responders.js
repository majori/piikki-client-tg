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
  loginUsername: (ctx) => {
    if (ctx.message.text.length < 20) {
      db.setUserState(ctx.message.from.id, states.loginPassword(ctx.message.text))
      .then(() => ctx.reply('Syötä salasana'));
    }
  },

  loginPassword: (ctx) => {
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

module.exports = { states, responders };
