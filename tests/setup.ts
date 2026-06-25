import { db } from "../src/database/knex";

beforeEach(async () => {
  await db("transactions").del();
  await db("wallets").del();
  await db("users").del();
});

afterAll(async () => {
  await db.destroy();
});