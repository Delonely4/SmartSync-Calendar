import { userRepository } from "../repositories/userRepository.js";
import type { IUser } from "../models/userInterface.js";
import { logger } from "../utils/loggerUtils.js";

export const userService = {
  async registerUser(userData: IUser) {
    try {
      const user = await userRepository.upsertUser(userData);
      logger.info(`User registered/updated: ${user.telegram_id}`);
      return user;
    } catch (err) {
      logger.error("Error in userService", err);
      throw err;
    }
  },
};
