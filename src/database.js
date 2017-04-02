const knex = require('knex');
const Promise = require('bluebird');
const cfg = require('../config');

const db = knex(cfg.db);

module.exports = {
  createUser: (telegramId) => db('user')
    .insert({ telegram_id: telegramId }),

  linkUser: (telegramId, username) => db('user')
    .where({ telegram_id: telegramId })
    .update({ piikki_username: username }),

  getUser: telegramId => db('user')
    .first()
    .where({ telegram_id: telegramId }),

  getUserState: telegramId => db('user')
    .first('json_state')
    .where({ telegram_id: telegramId })
    .then(res => (res ? JSON.parse(res.json_state) : null)),

  setUserState: (telegramId, state) => db('user')
    .where({ telegram_id: telegramId })
    .update({ json_state: (state ? JSON.stringify(state) : null) })
    .then(() => Promise.resolve()),
};
