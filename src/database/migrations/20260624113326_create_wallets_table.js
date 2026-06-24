/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("wallets", (table) => {
        table.increments("id").primary();

        table
            .integer("user_id")
            .unsigned()
            .unique()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.decimal("balance", 15, 2).notNullable().defaultTo(0);

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("wallets");
};
