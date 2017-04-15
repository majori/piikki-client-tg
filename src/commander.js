const _ = require('lodash');
const api = require('./api');
const session = require('./session');
const responders = require('./responders');
const helpers = require('./helpers');

module.exports = {

  // ## /kirjaudu
  // Link telegram id with piikki username
  login: async (ctx) => {
    // Check if there is already a link
    if (ctx.session.username) {
      ctx.reply(`Olet jo kirjautunut tunnuksella ${ctx.session.username}`);
      return;
    }

    // Start the login process
    await session.updateSession(ctx.from.id, session.constants.states.loginAskUsername());
    ctx.reply('Syötä Piikki-tunnuksesi');
  },

  // ## /saldo
  // Lists saldos in each group
  saldo: async (ctx) => {
    const user = await api.getUser(ctx.session.username);

    if (_.isEmpty(user.saldos)) {
      ctx.reply('Et ole liittynyt vielä mihinkään ryhmään.');
      return;
    }

    const saldos = _.map(user.saldos, (saldo, group) => `<b>${group}</b>: ${saldo}`);
    ctx.replyWithHTML(`Saldosi:\n${_.join(saldos, '\n')}`);
  },

  // ## /lisaa [amount]
  // Add credit by certain amount, default is 1
  add: async ctx => helpers.makeTransaction(ctx, false),

  // ## /viiva [amount]
  // Takes credit by certain amount
  subtract: async ctx => helpers.makeTransaction(ctx, true),

  // Process messages without a command
  message: (ctx) => {
    // For now we don't process non-message events,
    // such as edit events
    if (ctx.updateType !== 'message') return;

    // If message is empty or command, ignore it
    if (_.isEmpty(ctx.message.text) || (ctx.message.text[0] === '/')) return;

    // There is no events to react
    if (!ctx.session.state) return;

    // Process event in responder specified by the state type
    responders(ctx);
  },
};
