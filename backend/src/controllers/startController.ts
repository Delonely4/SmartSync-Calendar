import { Context } from "telegraf";
import { logger } from "../utils/loggerUtils.js";

export const startController = async (ctx: Context) => {
  try {
    const name = ctx.from?.first_name || "User";
    await ctx.reply(`Hi ${name}! I'm your SmartSync Calendar Bot.`);
    logger.info(`User started the bot ${ctx.from?.id}`);
  } catch (error) {
    logger.error("Error in start command", error);
    await ctx.reply("Something went wrong.");
  }
};
