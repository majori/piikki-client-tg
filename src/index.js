const Telegraf = require('telegraf');
const cfg = require('../config');
const commander = require('./commander');
const middleware = require('./middleware');

const bot = new Telegraf(cfg.tgToken);
bot.use(middleware.getSession);

bot.command('kirjaudu', commander.login);
bot.command('saldo', middleware.loggedIn, commander.saldo);
bot.on('message', commander.message);

// Setup webhook when in production
if (cfg.isProduction) {
  bot.telegram.setWebhook(`${cfg.appUrl}/bot${cfg.tgToken}`);
  bot.startWebhook(`/bot${cfg.tgToken}`, null, cfg.appPort);

// If env is development, get updates by polling
} else {
  bot.telegram.setWebhook(); // Unsubscribe webhook if it exists
  bot.startPolling();
}
