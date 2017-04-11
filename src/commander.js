const _ = require('lodash');
const db = require('./database');
const api = require('./api');
const responders = require('./responders');

module.exports = {
  async login(ctx) {
    if (ctx.session.username) {
      ctx.reply(`Olet jo kirjautunut tunnuksella ${ctx.session.username}`);
    } else {
      // Start the login process
      await db.setUserState(ctx.message.from.id, responders.states.loginUsername());
      ctx.reply('Syötä tunnus');
    }
  },

  async saldo(ctx) {
    const user = await api.getUser(ctx.session.username);

    if (_.isEmpty(user.saldos)) {
      ctx.reply('Et ole liittynyt vielä mihinkään ryhmään.');
      return;
    }

    const saldos = _.map(user.saldos, (saldo, group) => `${group}: ${saldo}`);
    ctx.reply(`Saldosi:\n${_.join(saldos, '\n')}`);
  },

  // Message without any command
  message: (ctx) => {
    // If message is empty or command, ignore it
    if (_.isEmpty(ctx.message.text) || (ctx.message.text[0] === '/')) return;

    // There is no messages to react
    if (!ctx.session.state) return;

    responders.responders[ctx.session.state.type](ctx);
  },
};
