const Telegraf = require('telegraf');
const cfg = require('../config');

const commander = require('./commander');

const bot = new Telegraf(cfg.tgToken);

bot.use(commander.middleware.getSession);

bot.command('kirjaudu', commander.login);
bot.command('saldo', commander.middleware.loggedIn, commander.saldo);
bot.on('message', commander.message);

if (cfg.isProduction) {
  bot.telegram.setWebhook(`${cfg.appUrl}/bot${cfg.tgToken}`);
} else {
  bot.startPolling();
}

