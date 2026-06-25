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
    message: "Express server is running",
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