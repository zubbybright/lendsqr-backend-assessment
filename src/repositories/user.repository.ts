import { db } from "../database/knex";
import { Knex } from "knex";


export class UserRepository {
    async findById(userId: number) {
        return db("users").where({ id: userId }).first();
    }

    async findByEmail(email: string) {
        return db("users")
            .where({ email })
            .first();
    }

    async findByPhone(phone: string) {
        return db("users")
            .where({ phone })
            .first();
    }

    async create(
        userData: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            password_hash: string;
        },
        trx?: Knex.Transaction
    ) {
        const query = trx ?? db;

        const [id] = await query("users").insert(userData);

        return query("users")
            .where({ id })
            .first();
    }
}