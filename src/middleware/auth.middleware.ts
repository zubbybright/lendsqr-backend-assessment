import { NextFunction, Request, Response } from "express";

import { UserRepository } from "../repositories/user.repository";

export class AuthMiddleware {
  private userRepository = new UserRepository();

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authorization =
        req.headers.authorization;

      if (!authorization) {
        res.status(401).json({
          success: false,
          message: "Authorization header missing",
        });

        return;
      }

      const [scheme, token] =
        authorization.split(" ");

      if (
        scheme !== "Bearer" ||
        !token
      ) {
        res.status(401).json({
          success: false,
          message: "Invalid authorization format",
        });

        return;
      }

      const userId = Number(token);

      if (Number.isNaN(userId)) {
        res.status(401).json({
          success: false,
          message: "Invalid token",
        });

        return;
      }

      const user =
        await this.userRepository.findById(
          userId
        );

      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found",
        });

        return;
      }

      req.user = user;

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
}