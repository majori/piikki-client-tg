const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const cfg = require('../config');
const commander = require('./commander');
const middleware = require('./middleware');
const session = require('./session');

const bot = new Telegraf(cfg.tgToken);

// Apply middleware
bot.use(commandParts());
bot.use(middleware.getSession);

bot.command('start', middleware.isPrivate, commander.login);
bot.command('kirjaudu', middleware.isPrivate, commander.login);

bot.command('saldo', middleware.loggedIn, commander.saldo);
bot.command('lisaa', middleware.loggedIn, commander.add);
bot.command('nakki', middleware.loggedIn, commander.addWithEffort);
bot.command('viiva', middleware.loggedIn, commander.subtract);

bot.on('message', commander.message);

async function startBot() {
  // Make sure that users are available
  // before continuing
  await session.syncSessionsFromDatabase();

  // Get own username to handle commands such as /start@my_bot
  bot.options.username = (await bot.telegram.getMe()).username;

  // Setup webhook when in production
  if (cfg.isProduction) {
    bot.telegram.setWebhook(`${cfg.appUrl}/bot${cfg.tgToken}`);
    bot.startWebhook(`/bot${cfg.tgToken}`, null, cfg.appPort);

  // If env is development, get updates by polling
  } else {
    bot.telegram.deleteWebhook(); // Unsubscribe webhook if it exists
    bot.startPolling();
  }
}

startBot();
