import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Express server is running' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});

export default app;
