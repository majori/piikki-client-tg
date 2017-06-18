const _ = require('lodash');
const api = require('./api');

module.exports = {
  makeTransaction: async (ctx, subtract, comment) => {
    const amount = (_.isEmpty(ctx.state.command.args)) ? 1 :
      _.chain(ctx.state.command.splitArgs)
      .first()
      .toNumber()
      .value();

    if (amount > 0) {
      if (ctx.session.defaultGroup) {
        const res = await api.makeTransaction(
          ctx.session.defaultGroup,
          ctx.session.username,
          (subtract ? -amount : amount),
          comment
        );
        if (res) {
          ctx.reply(`Saldosi ryhmässä ${ctx.session.defaultGroup}: ${res.saldo}`);
        }
      }
    } else {
      ctx.reply(`"${_.first(ctx.state.command.splitArgs)}" ei ollut positiivinen luku`);
    }
  },
};
