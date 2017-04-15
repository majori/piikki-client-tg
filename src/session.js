const _ = require('lodash');
const db = require('./database');

let sessions = {};

const syncSessionsFromDatabase = async () => {
  const users = await db.getUsers();

  sessions = _.chain(users)
    .map(user => ({
      id: user.telegram_id,
      username: user.piikki_username,
      defaultGroup: user.default_group,
      state: JSON.parse(user.json_state),
    }))
    .keyBy('id')
    .value();
};

const types = {
  LOGIN_ASK_PASSWORD: 'LOGIN_ASK_PASSWORD',
  LOGIN_ASK_USERNAME: 'LOGIN_ASK_USERNAME',
};

// Possible session states
const states = {
  loginAskPassword: username => ({
    type: types.LOGIN_ASK_PASSWORD,
    payload: {
      username,
    },
  }),

  loginAskUsername: () => ({
    type: types.LOGIN_ASK_USERNAME,
  }),
};

const getUser = async (id) => {
  let user = sessions[id];

  // If user doesn't exist, create new user
  if (!user) {
    await db.createUser(id);
    user = await db.getUser(id);
    sessions[id] = user;
  }

  return user;
};

const linkUser = async (id, username) => {
  sessions[id].username = username;
  return db.linkUser(id, username);
};

const setDefaultGroup = async (id, groupName) => {
  sessions[id].defaultGroup = groupName;
  return db.setDefaultGroup(id, groupName);
};

const updateSession = async (id, state) => {
  sessions[id].state = state;
  return db.setUserState(id, state);
};

const resetSession = async id => updateSession(id, null);

module.exports = {
  getUser,
  linkUser,
  setDefaultGroup,
  updateSession,
  resetSession,
  syncSessionsFromDatabase,
  constants: {
    types,
    states,
  },
};
