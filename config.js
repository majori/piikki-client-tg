const cfg = {};

cfg.env = process.env.NODE_ENV || 'development';
cfg.isProduction = (cfg.env === 'production');

cfg.appUrl = process.env.PIIKKIBOT_APP_URL;
cfg.appPort = process.env.port;
cfg.apiUrl = process.env.PIIKKIBOT_BACKEND_URL;
cfg.apiToken = process.env.PIIKKIBOT_BACKEND_TOKEN;

cfg.tgToken = process.env.PIIKKIBOT_TELEGRAM_TOKEN;

cfg.db = {
  client: 'mssql',
  connection: {
    server: process.env.PIIKKIBOT_DATABASE_HOSTNAME,
    user: process.env.PIIKKIBOT_DATABASE_USER,
    password: process.env.PIIKKIBOT_DATABASE_PASSWORD,
    options: {
      port: process.env.PIIKKIBOT_DATABASE_PORT || 1433,
      database: process.env.PIIKKIBOT_DATABASE_NAME,
      encrypt: true,
    },
  },
  migrations: {
    disableTransactions: true,
    tableName: 'knex_migrations',
  },
};

module.exports = cfg;
