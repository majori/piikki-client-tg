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
  getUsers: async () => get('users'),
  getUser: async username => get(`users/${username}`),
  deleteUser: async username => del('users', { username }),
  createUser: async (username, password) => post('users/create', { username, password }),
  authenticateUser: async (username, password) => post('users/authenticate', { username, password }),
  resetPassword: async (username, oldPassword, newPassword) => put('users/reset/password', { username, oldPassword, newPassword }),
  resetUsername: async (oldUsername, newUsername, password) => put('users/reset/username', { oldUsername, newUsername, password }),
  getGroups: async () => get('groups'),
  getGroupMembers: async groupName => get(`groups/${groupName}/members`),
  getGroupMember: async (groupName, username) => get(`groups/${groupName}/members/${username}`),
  createGroup: async groupName => post('groups/create', { groupName }),
  addMemberToGroup: async (groupName, username) => post(`groups/${groupName}/addMember`, { username }),
  removeMemberFromGroup: async (groupName, username) => del(`groups/${groupName}/removeMember`, { username }),
  makeTransaction: async (groupName, username, amount) => post('transaction', { groupName, username, amount }),
};
