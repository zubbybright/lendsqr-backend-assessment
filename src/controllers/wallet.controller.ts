import { Request, Response } from "express";

import { WalletService } from "../services/wallet.service";
import { NextFunction } from "express";

import {
  fundWalletSchema,
  withdrawWalletSchema,
  transferWalletSchema,
} from "../validators/wallet.validator";

export class WalletController {
  private walletService = new WalletService();

  fundWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { amount } =
        fundWalletSchema.parse(req.body);

      const result =
        await this.walletService.fundWallet(
          req.user!.id,
          amount
        );

      res.status(200).json({
        success: true,
        message: "Wallet funded successfully",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  withdrawFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { amount } =
        withdrawWalletSchema.parse(req.body);

      const result =
        await this.walletService.withdrawFunds(
          req.user!.id,
          amount
        );

      res.status(200).json({
        success: true,
        message: "Withdrawal successful",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  transferFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        recipientUserId,
        amount,
      } = transferWalletSchema.parse(req.body);

      const result =
        await this.walletService.transferFunds(
          req.user!.id,
          recipientUserId,
          amount
        );

      res.status(200).json({
        success: true,
        message: "Transfer successful",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };
}