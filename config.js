const cfg = {};

cfg.apiUrl = process.env.PIIKKIBOT_BACKEND_URL;
cfg.apiToken = process.env.PIIKKIBOT_BACKEND_TOKEN;

cfg.tgToken = process.env.PIIKKIBOT_TELEGRAM_TOKEN;

module.exports = cfg;