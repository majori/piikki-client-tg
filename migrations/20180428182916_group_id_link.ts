import Knex from 'knex';

export const up = async (knex: Knex) => {
  return knex.schema.createTable('groups', table => {
    table.integer('tg_group_id')
      .primary();
    table.integer('piikki_group_id')
      .notNullable();
    table.integer('admin_user_id')
      .notNullable();
  });
};

export const down = (knex: Knex) => {
  return knex.schema.dropTable('groups');
};
