import express, { Request, Response } from "express";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import walletRoutes from "./routes/wallet.routes";

const app = express();

const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;