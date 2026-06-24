/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("transactions", (table) => {
        table.increments("id").primary();

        table
            .integer("wallet_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("wallets")
            .onDelete("CASCADE");

        table.string("transaction_type").notNullable();

        table.decimal("amount", 15, 2).notNullable();

        table.string("reference").notNullable();

        table.index(["wallet_id"]);
        table.index(["reference"]);

        table.integer("related_wallet_id").unsigned().nullable();

        table.string("status").notNullable().defaultTo("SUCCESS");

        table.text("description").nullable();

        table.timestamps(true, true);



    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("transactions");
};
