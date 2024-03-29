import type { Knex } from 'knex';

const defaultDbConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING || {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export const development = {
  ...defaultDbConfig,
  connection: process.env.PG_CONNECTION_STRING || {
    host: 'localhost',
    port: 5001,
    database: 'postgres',
    user: 'postgres',
    password: 'password12!',
  },
};

export const production = {
  ...defaultDbConfig,
  migrations: {
    extension: 'js',
  },
};
