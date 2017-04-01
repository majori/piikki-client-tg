const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');
const api = require('./api');
const cfg = require('../config');

const bot = new TelegramBot(cfg.tgToken, cfg.tgBotOptions);

if (cfg.isProduction) {
  bot.setWebhook(`${cfg.appUrl}/bot${cfg.tgToken}`);
}

module.exports = () => {
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  });
};
