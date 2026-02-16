import { Context } from "telegraf";
import { userService } from "../services/userServices.js";
import { logger } from "../utils/loggerUtils.js";
import type { IUser } from "../types/userInterface.js";

export const startController = async (ctx: Context) => {
  try {
    const telegramId = ctx.from!.id;
    const firstName = ctx.from?.first_name || "User";

   const userData: IUser = {
     telegram_id: telegramId,
     ...(ctx.from?.username && { username: ctx.from.username }),
      ...(ctx.from?.first_name && { first_name: ctx.from.first_name }),
      ...(ctx.from?.last_name && { last_name: ctx.from.last_name }),
   };
    

    await userService.registerUser(userData);
    logger.info(`User started the bot ${ctx.from?.id}`)



    await ctx.reply(
      `Hi <b>${firstName}</b>! I'm your <b>SmartSync Calendar Bot</b>.\n\n` +
      `Use /connect to sync your Google Calendar with me!\n\n` +
      `Use /status to check connection status`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    logger.error("Error in start command", error);
    await ctx.reply("Something went wrong.");
  }
};
