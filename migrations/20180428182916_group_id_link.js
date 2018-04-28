exports.up = function(knex, Promise) {
  return knex.schema.createTable('groups', table => {
    table.integer('tg_id')
      .primary();
    table.integer('piikki_group_id')
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('groups');
};
