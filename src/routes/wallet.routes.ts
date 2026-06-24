import { Router } from "express";

import { WalletController } from "../controllers/wallet.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

const walletController =
  new WalletController();

const authMiddleware =
  new AuthMiddleware();

router.post(
  "/fund",
  authMiddleware.authenticate,
  walletController.fundWallet
);

router.post(
  "/withdraw",
  authMiddleware.authenticate,
  walletController.withdrawFunds
);

router.post(
  "/transfer",
  authMiddleware.authenticate,
  walletController.transferFunds
);

export default router;