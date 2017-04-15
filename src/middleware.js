const _ = require('lodash');
const session = require('./session');

module.exports = {
  getSession: async (ctx, next) => {
    ctx.session = await session.getUser(ctx.from.id);
    next();
  },

  // Check if message is from private chat
  isPrivate: (ctx, next) => {
    if (ctx.chat.type === 'group') {
      ctx.telegram.sendMessage(
        ctx.chat.id,
        `Tämä komento toimii vain <a href="t.me/${ctx.options.username}">private-chatissa</a>.`,
        {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }
      );
    } else {
      next();
    }
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
