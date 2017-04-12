const _ = require('lodash');
const db = require('./database');

module.exports = {
  async getSession(ctx, next) {
    // For now we don't process non-message events,
    // such as edit events
    if (ctx.updateType !== 'message') return;

    let user = await db.getUser(ctx.message.from.id);

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

  loggedIn: (ctx, next) => {
    // Check if session exists
    if (_.has(ctx, ['session', 'username']) && !_.isNull(ctx.session.username)) {
      next();
    } else {
      ctx.reply('Et ole kirjautunut vielä sisään, voit kirjautua komennolla /kirjaudu');
    }
  },
};
