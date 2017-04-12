const request = require('superagent');
const _ = require('lodash');

const cfg = require('../config');

async function makeRequest(method, url, payload) {
  const req = request(method, `${cfg.apiUrl}/global/${url}`);

  req.set('Authorization', cfg.apiToken);

  if (_.includes(['POST', 'PUT', 'DELETE'], method) && payload) {
    req.send(payload);
  }

  try {
    const res = await req;
    return res.body.result;
  } catch (err) {
    throw err;
  }
}

async function get(url) {
  return makeRequest('GET', url);
}

async function post(url, payload) {
  return makeRequest('POST', url, payload);
}

async function put(url, payload) {
  return makeRequest('PUT', url, payload);
}

async function del(url, payload) {
  return makeRequest('DELETE', url, payload);
}

module.exports = {
  async getUsers() {
    return get('/users');
  },

  async getUser(username) {
    return get(`/users/${username}`);
  },

  async deleteUser(username) {
    return del('/users', { username });
  },

  async createUser(username, password) {
    return post('/users/create', { username, password });
  },

  async authenticateUser(username, password) {
    return post('/users/authenticate', { username, password });
  },

  async resetPassword(username, oldPassword, newPassword) {
    return put('/users/reset/password', { username, oldPassword, newPassword });
  },

  async resetUsername(oldUsername, newUsername, password) {
    return put('/users/reset/username', { oldUsername, newUsername, password });
  },

  async getGroups() {
    return get('/groups');
  },

  async getGroupMembers(groupName) {
    return get(`/groups/${groupName}/members`);
  },

  async getGroupMember(groupName, username) {
    return get(`/groups/${groupName}/members/${username}`);
  },

  async createGroup(groupName) {
    return post('/groups/create', { groupName });
  },

  async addMemberToGroup(groupName, username) {
    return post(`/groups/${groupName}/addMember`, { username });
  },

  async removeMemberFromGroup(groupName, username) {
    return del(`/groups/${groupName}/removeMember`, { username });
  },

  async makeTransaction(groupName, username, amount) {
    return del('/transaction', { groupName, username, amount });
  },
};
