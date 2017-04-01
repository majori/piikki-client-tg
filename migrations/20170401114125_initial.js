
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('user', (table) => {
    table.increments('id')
      .primary();
    table.integer('telegram_id')
      .notNullable()
      .unique();
    table.string('piikki_username')
      .notNullable()
      .unique();
    table.text('json_state');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('user'),
]);
