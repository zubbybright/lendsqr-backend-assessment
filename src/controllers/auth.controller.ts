import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { registerUserSchema } from "../validators/auth.validator";

export class AuthController {
  private authService = new AuthService();

  register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const validatedData =
        registerUserSchema.parse(req.body);

      const result =
        await this.authService.register(
          validatedData
        );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}