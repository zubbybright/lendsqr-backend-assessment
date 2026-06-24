import { z } from "zod";

export const fundWalletSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero"),
});

export const withdrawWalletSchema =
  fundWalletSchema;

export const transferWalletSchema =
  z.object({
    recipientUserId: z.number(),
    amount: z
      .number()
      .positive("Amount must be greater than zero"),
  });