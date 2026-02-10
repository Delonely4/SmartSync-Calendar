import { Telegraf } from "telegraf";
import { startController } from "./startController.js";

export const setupControllers = (bot: Telegraf) => {
  bot.start(startController);
}

