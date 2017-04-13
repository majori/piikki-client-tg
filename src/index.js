const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const cfg = require('../config');
const commander = require('./commander');
const middleware = require('./middleware');

const bot = new Telegraf(cfg.tgToken);

// Apply middleware
bot.use(commandParts());
bot.use(middleware.getSession);

bot.command('start', commander.login);
bot.command('kirjaudu', commander.login);

bot.command('saldo', middleware.loggedIn, commander.saldo);
bot.command('lisaa', middleware.loggedIn, commander.add);
bot.command('viiva', middleware.loggedIn, commander.subtract);

bot.on('message', commander.message);

// Get own username to handle commands such as /start@my_bot
bot.telegram.getMe()
.then((botInfo) => {
  bot.options.username = botInfo.username;
});

// Setup webhook when in production
if (cfg.isProduction) {
  bot.telegram.setWebhook(`${cfg.appUrl}/bot${cfg.tgToken}`);
  bot.startWebhook(`/bot${cfg.tgToken}`, null, cfg.appPort);

// If env is development, get updates by polling
} else {
  bot.telegram.deleteWebhook(); // Unsubscribe webhook if it exists
  bot.startPolling();
}
