export const development = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'localhost',
    port: 5001,
    database: 'postgres',
    user: 'postgres',
    password: 'password12!',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export const production = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
