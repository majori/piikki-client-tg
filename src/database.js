const _ = require('lodash');
const knex = require('knex');
const cfg = require('../config');

const db = knex(cfg.db);

module.exports = {
  createUser: async telegramId => db('user')
    .insert({ telegram_id: telegramId }),

  linkUser: async (telegramId, username) => db('user')
    .where({ telegram_id: telegramId })
    .update({ piikki_username: username }),

  unlinkUser: async telegramId => db('user')
    .where({ telegram_id: telegramId })
    .update({ piikki_username: null, json_state: null }),

  getUser: async telegramId => db('user')
    .first()
    .where({ telegram_id: telegramId }),

  getUsers: async () => db('user'),

  getUserState: async (telegramId) => {
    const user = await db('user')
      .first('json_state')
      .where({ telegram_id: telegramId });

    return user ? JSON.parse(user.json_state) : null;
  },

  setUserState: async (telegramId, state) => db('user')
    .where({ telegram_id: telegramId })
    .update({ json_state: (_.isObject(state) ? JSON.stringify(state) : null) }),

  setDefaultGroup: async (telegramId, groupName) => db('user')
    .where({ telegram_id: telegramId })
    .update({ default_group: groupName }),
};
