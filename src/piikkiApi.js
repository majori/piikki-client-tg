const request = require('superagent');
const prefix = require('superagent-prefix');
const Promise = require('bluebird');

const BASE_URL = prefix(process.env.PIIKKIBOT_BACKEND_URL)
const TOKEN = process.env.PIIKKIBOT_BACKEND_TOKEN;

let api = {};

api.getUsers = () => new Promise(resolve, reject, () => {
  request
    .get('/global/users')
    .use(BASE_URL)
    .set('Authorization', TOKEN)
    .end((err, res) => {
        if (err) reject(err)
    });
});
    

module.exports = api;