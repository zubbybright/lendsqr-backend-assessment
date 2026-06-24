import { db } from "../database/knex";
import { Knex } from "knex";

export class TransactionRepository {
    async create(
        transactionData: {
            wallet_id: number;
            transaction_type: string;
            amount: number;
            reference: string;
            related_wallet_id?: number | null;
            status?: string;
            description?: string;
        },
        trx?: Knex.Transaction
    ) {
        const query = trx ?? db;

        const [id] = await query("transactions").insert({
            status: "SUCCESS",
            ...transactionData,
        });

        return query("transactions")
            .where({ id })
            .first();
    }
}