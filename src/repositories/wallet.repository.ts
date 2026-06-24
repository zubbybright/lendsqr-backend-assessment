import { db } from "../database/knex";
import { Knex } from "knex";

export class WalletRepository {
  async create(userId: number, trx?: Knex.Transaction) {
    const query = trx ?? db;

    const [id] = await query("wallets").insert({
      user_id: userId,
      balance: 0,
    });

    return query("wallets")
      .where({ id })
      .first();
  }

  async findByUserId(userId: number) {
    return db("wallets")
      .where({ user_id: userId })
      .first();
  }
}