const _ = require('lodash');
const db = require('./database');

module.exports = {
  getSession: async (ctx, next) => {
    // For now we don't process non-message events,
    // such as edit events
    if (ctx.updateType !== 'message') return;

    let user = await db.getUser(ctx.message.from.id);

    // If user doesn't exist, create new user
    if (!user) {
      await db.createUser(ctx.message.from.id);
      user = await db.getUser(ctx.message.from.id);
    }

    ctx.session = {
      username: user.piikki_username,
      defaultGroup: user.default_group,
      state: JSON.parse(user.json_state),
    };

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
