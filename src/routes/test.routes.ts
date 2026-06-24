import { Router } from "express";

import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

const authMiddleware =
  new AuthMiddleware();

router.get(
  "/me",
  authMiddleware.authenticate,
  async (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

export default router;