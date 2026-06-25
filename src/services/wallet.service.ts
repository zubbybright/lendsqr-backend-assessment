import { randomUUID } from "crypto";

import { db } from "../database/knex";

import { WalletRepository } from "../repositories/wallet.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { AppError } from "../errors/AppError";

export class WalletService {
  constructor(
    private walletRepository = new WalletRepository(),
    private transactionRepository = new TransactionRepository()
  ) { }

  async fundWallet(
    userId: number,
    amount: number
  ) {
    const wallet =
      await this.walletRepository.findByUserId(
        userId
      );

    if (!wallet) {
      throw new AppError(404, "Wallet not found");
    }

    return db.transaction(async (trx) => {
      const newBalance =
        Number(wallet.balance) + amount;

      const updatedWallet =
        await this.walletRepository.updateBalance(
          wallet.id,
          newBalance,
          trx
        );

      await this.transactionRepository.create(
        {
          wallet_id: wallet.id,
          transaction_type: "FUND",
          amount,
          reference: randomUUID(),
          description: "Wallet funding",
        },
        trx
      );


      return {
        ...updatedWallet,
        balance: Number(updatedWallet.balance),
      };
    });
  }

  async withdrawFunds(
    userId: number,
    amount: number
  ) {
    const wallet =
      await this.walletRepository.findByUserId(
        userId
      );

    if (!wallet) {
      throw new AppError(404, "Wallet not found");
    }

    if (Number(wallet.balance) < amount) {
      throw new AppError(400, "Insufficient wallet balance");

    }

    return db.transaction(async (trx) => {
      const newBalance =
        Number(wallet.balance) - amount;

      const updatedWallet =
        await this.walletRepository.updateBalance(
          wallet.id,
          newBalance,
          trx
        );

      await this.transactionRepository.create(
        {
          wallet_id: wallet.id,
          transaction_type: "WITHDRAWAL",
          amount,
          reference: randomUUID(),
          description: "Wallet withdrawal",
        },
        trx
      );

      return {
        ...updatedWallet,
        balance: Number(updatedWallet.balance),
      };
    });
  }

  async transferFunds(
    senderUserId: number,
    recipientUserId: number,
    amount: number
  ) {
    const senderWallet =
      await this.walletRepository.findByUserId(
        senderUserId
      );

    const recipientWallet =
      await this.walletRepository.findByUserId(
        recipientUserId
      );

    if (!senderWallet) {
      throw new AppError(404, "Sender wallet not found");
    }

    if (!recipientWallet) {
      throw new AppError(404, "Recipient wallet not found");
    }

    if (
      Number(senderWallet.balance) < amount
    ) {
      throw new AppError(400, "Insufficient wallet balance");
    }

    const reference = randomUUID();

    return db.transaction(async (trx) => {
      await this.walletRepository.updateBalance(
        senderWallet.id,
        Number(senderWallet.balance) - amount,
        trx
      );

      await this.walletRepository.updateBalance(
        recipientWallet.id,
        Number(recipientWallet.balance) + amount,
        trx
      );

      await this.transactionRepository.create(
        {
          wallet_id: senderWallet.id,
          transaction_type:
            "TRANSFER_SENT",
          amount,
          reference,
          related_wallet_id:
            recipientWallet.id,
          description:
            "Transfer sent",
        },
        trx
      );

      await this.transactionRepository.create(
        {
          wallet_id: recipientWallet.id,
          transaction_type:
            "TRANSFER_RECEIVED",
          amount,
          reference,
          related_wallet_id:
            senderWallet.id,
          description:
            "Transfer received",
        },
        trx
      );

      return {
        reference,
      };
    });
  }
}