
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('user', (table) => {
    table.integer('telegram_id')
      .primary();
    table.string('piikki_username')
      .unique();
    table.text('json_state');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('user'),
]);
