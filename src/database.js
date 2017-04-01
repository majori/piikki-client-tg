const knex = require('knex');
const cfg = require('../config');

const db = knex(cfg.db);

module.exports = {
  createUser: (telegramId, username) => db('user')
    .insert({ telegram_id: telegramId, piikki_username: username }),

  getUsername: telegramId => db('user')
    .first('piikki_username')
    .where({ telegram_id: telegramId }),

  getUserState: telegramId => db('user')
    .first('json_state')
    .where({ telegram_id: telegramId })
    .then(res => (res ? JSON.parse(res.json_state) : null)),
};
