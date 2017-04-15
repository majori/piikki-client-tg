const _ = require('lodash');
const api = require('./api');
const session = require('./session');
const responders = require('./responders');

module.exports = {

  // ## /kirjaudu
  // Link telegram id with piikki username
  login: async (ctx) => {
    if (ctx.session.username) {
      ctx.reply(`Olet jo kirjautunut tunnuksella ${ctx.session.username}`);
    } else {
      // Start the login process
      await session.updateSession(ctx.message.from.id, session.constants.states.loginAskUsername());
      ctx.reply('Syötä Piikki-tunnuksesi');
    }
  },

  // ## /saldo
  // Lists saldos in each group
  saldo: async (ctx) => {
    const user = await api.getUser(ctx.session.username);

    if (_.isEmpty(user.saldos)) {
      ctx.reply('Et ole liittynyt vielä mihinkään ryhmään.');
      return;
    }

    const saldos = _.map(user.saldos, (saldo, group) => `*${group}*: ${saldo}`);
    ctx.replyWithMarkdown(`Ryhmiesi saldot:\n${_.join(saldos, '\n')}`);
  },

  // ## /lisaa [amount]
  // Add credit by certain amount, default is 1
  add: async (ctx) => {
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

  // ## /viiva [amount]
  // Takes credit by certain amount
  subtract: async (ctx) => {
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

  // Process messages without a command
  message: (ctx) => {
    // If message is empty or command, ignore it
    if (_.isEmpty(ctx.message.text) || (ctx.message.text[0] === '/')) return;

    // There is no events to react
    if (!ctx.session.state) return;

    // Process event in responder specified by the state type
    responders(ctx);
  },
};
