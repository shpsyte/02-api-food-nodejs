import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('food', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('date').notNullable()
    table.boolean('is_diet').notNullable()
    table.timestamps(true, true)
    table.uuid('user_id').references('id').inTable('users').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('food')
}
