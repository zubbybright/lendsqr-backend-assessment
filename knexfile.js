require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

/**
 * @type {Object.<string, import("knex").Knex.Config>}
 */

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: "./src/database/migrations",
  },
  seeds: {
    directory: "./src/database/seeds",
  },
};

module.exports = {
  development: config,
  production: config,
};