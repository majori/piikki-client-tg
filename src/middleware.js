const _ = require('lodash');
const session = require('./session');

module.exports = {
  getSession: async (ctx, next) => {
    // For now we don't process non-message events,
    // such as edit events
    if (ctx.updateType !== 'message') return;

    ctx.session = await session.getUser(ctx.message.from.id);

    next();
  },

  // Check if there is a link between telegram ID and piikki username
  loggedIn: (ctx, next) => {
    // Check if session exists
    if (_.has(ctx, ['session', 'username']) && !_.isNull(ctx.session.username)) {
      next();
    } else {
      ctx.reply('Et ole kirjautunut vielä sisään, voit kirjautua komennolla /kirjaudu');
    }
  },
};
