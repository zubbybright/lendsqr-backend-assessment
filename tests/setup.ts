import { db } from "../src/database/knex";

beforeEach(async () => {
  jest.restoreAllMocks();

  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      data: null,
    }),
  } as Response);

  await db("transactions").del();
  await db("wallets").del();
  await db("users").del();
});

afterAll(async () => {
  await db.destroy();
});