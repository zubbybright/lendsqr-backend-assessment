import bcrypt from "bcrypt";
import { db } from "../database/knex";
import { RegisterUserDto } from "../types/auth.types";

import { UserRepository } from "../repositories/user.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { KarmaService } from "./karma.service";
import { AppError } from "../errors/AppError";

export class AuthService {
  constructor(
    private userRepository = new UserRepository(),
    private walletRepository = new WalletRepository(),
    private karmaService = new KarmaService()
  ) { }
  async register(userData: RegisterUserDto) {
    const existingEmail = await this.userRepository.findByEmail(
      userData.email
    );

    if (existingEmail) {
      throw new AppError(409, "Email already exists");
    }

    const existingPhone = await this.userRepository.findByPhone(
      userData.phone
    );

    if (existingPhone) {
      throw new AppError(409, "Phone number already exists");
    }

    const isBlacklisted = await this.karmaService.isBlacklisted(
      userData.email
    );

    if (isBlacklisted) {
      throw new AppError(403, "User is blacklisted and cannot be onboarded");
    }

    const passwordHash = await bcrypt.hash(
      userData.password,
      10
    );

    return db.transaction(async (trx) => {
      const user = await this.userRepository.create(
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          password_hash: passwordHash,
        },
        trx
      );

      const wallet = await this.walletRepository.create(
        user.id,
        trx
      );


      return {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
        },
        wallet: {
          id: wallet.id,
          balance: Number(wallet.balance),
        },
      };
    });
  }
}