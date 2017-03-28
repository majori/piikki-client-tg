const request = require('superagent');
const Promise = require('bluebird');
const _ = require('lodash');

const cfg = require('../config');

module.exports = {
  getUsers: () =>
    get('/users'),

  getUser: (username) =>
    get(`/users/${username}`),

  deleteUser: (username) =>
    del(`/users`, { username }),

  createUser: (username, password) =>
    post('/users/create', { username, password }),

  authenticateUser: (username, password) =>
    post('/users/authenticate', { username, password }),

  resetPassword: (username, oldPassword, newPassword) =>
    put('/users/reset/password', { username, oldPassword, newPassword }),

  resetUsername: (oldUsername, newUsername, password) =>
    put('/users/reset/username', { oldUsername, newUsername, password }),

  getGroups: () =>
    get('/groups'),

  getGroupMembers: (groupName) =>
    get(`/groups/${groupName}/members`),

  getGroupMember: (groupName, username) =>
    get(`/groups/${groupName}/members/${username}`),

  createGroup: (groupName) =>
    post('/groups/create', { groupName }),

  addMemberToGroup: (groupName, username) =>
    post(`/groups/${groupName}/addMember`, { username }),

  removeMemberFromGroup: (groupName, username) =>
    del(`/groups/${groupName}/removeMember`, { username }),

  makeTransaction: (groupName, username, amount) =>
    del('/transaction', { groupName, username, amount }),
};

const get = (url) => makeRequest('GET', url);
const post = (url, payload) => makeRequest('POST', url, payload);
const put = (url, payload) => makeRequest('PUT', url, payload);
const del = (url, payload) => makeRequest('DELETE', url, payload);

const makeRequest = (method, url, payload) => new Promise((resolve, reject) => {
    const req = request(method, `${cfg.apiUrl}/global/${url}`);

    req.set('Authorization', cfg.apiToken);

    if (_.includes(['POST', 'PUT', 'DELETE'], method) && payload) {
        req.send(payload);
    }

    req.end((err, res) => {
        (err || !res.body.ok)
            ? reject(err)
            : resolve(res.body.result);
    });
});
