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

  async add(ctx) {
    const amount = (_.isEmpty(ctx.state.command.args)) ? 1 :
      _.chain(ctx.state.command.splitArgs)
      .first()
      .toLength()
      .value();

    if (amount > 0) {
      if (ctx.session.defaultGroup) {
        const res = await api.makeTransaction(ctx.session.defaultGroup, ctx.session.username, amount);
        if (res) {
          ctx.reply(`Saldosi ryhmässä ${ctx.session.defaultGroup}: ${_.first(res).saldo}`);
        }
      }
    } else {
      ctx.reply(`"${_.first(ctx.state.command.splitArgs)}" ei ollut positiivinen kokonaisluku`);
    }
  },

  async subtract(ctx) {
    const amount = (_.isEmpty(ctx.state.command.args)) ? 1 :
      _.chain(ctx.state.command.splitArgs)
      .first()
      .toLength()
      .value();

    if (amount > 0) {
      if (ctx.session.defaultGroup) {
        const res = await api.makeTransaction(ctx.session.defaultGroup, ctx.session.username, -amount);
        if (res) {
          ctx.reply(`Saldosi ryhmässä ${ctx.session.defaultGroup}: ${_.first(res).saldo}`);
        }
      }
    } else {
      ctx.reply(`"${_.first(ctx.state.command.splitArgs)}" ei ollut positiivinen kokonaisluku`);
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
};
