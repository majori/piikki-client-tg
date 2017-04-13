const knex = require('knex');
const cfg = require('../config');

const db = knex(cfg.db);

module.exports = {
  async createUser(telegramId) {
    return db('user')
    .insert({ telegram_id: telegramId });
  },

  async linkUser(telegramId, username) {
    return db('user')
    .where({ telegram_id: telegramId })
    .update({ piikki_username: username });
  },

  async unlinkUser(telegramId) {
    return db('user')
    .where({ telegram_id: telegramId })
    .update({ piikki_username: null, json_state: null });
  },

  async getUser(telegramId) {
    return db('user')
    .first()
    .where({ telegram_id: telegramId });
  },

  async getUserState(telegramId) {
    const user = await db('user')
      .first('json_state')
      .where({ telegram_id: telegramId });

    return user ? JSON.parse(user.json_state) : null;
  },

  async setUserState(telegramId, state) {
    return db('user')
    .where({ telegram_id: telegramId })
    .update({ json_state: (state ? JSON.stringify(state) : null) });
  },

  async setDefaultGroup(telegramId, groupName) {
    return db('user')
    .where({ telegram_id: telegramId })
    .update({ default_group: groupName });
  },
};
