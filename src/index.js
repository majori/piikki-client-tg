const TelegramBot = require('node-telegram-bot-api');
const _ = require('lodash');

const piikkiApi = require('./api');
const cfg = require('../config');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(cfg.tgToken, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/create (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  piikkiApi.createUser('tg_test', 'salasana')
    .then(res => bot.sendMessage(chatId, res));
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', msg => {
  const chatId = msg.chat.id;

  piikkiApi.getUsers()
    .then((users) => 
      bot.sendMessage(chatId, _.chain(users).map(user => user.username).join(', ').value())
    );

});
