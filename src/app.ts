import express, { Request, Response } from "express";

import authRoutes from "./routes/auth.routes";
import walletRoutes from "./routes/wallet.routes";
import testRoutes from "./routes/test.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Lendsqr Backend Assessment API",
    version: "v1",
    endpoints: {
      health: "/health",
      register: "POST /api/v1/auth/register",
      fundWallet: "POST /api/v1/wallet/fund",
      withdrawFunds: "POST /api/v1/wallet/withdraw",
      transferFunds: "POST /api/v1/wallet/transfer",
    },
    documentation:
      "https://documenter.getpostman.com/view/36142471/2sBXwyFmJz",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", testRoutes);
app.use("/api/v1/wallet", walletRoutes);

app.use(errorMiddleware);
export default app;