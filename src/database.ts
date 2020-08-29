import Knex from 'knex';
import config from './config';
import * as knexfile from './knexfile';

export const knex = Knex(
  config.env.prod ? knexfile.production : knexfile.development,
);
