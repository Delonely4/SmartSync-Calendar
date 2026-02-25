import { Telegraf } from "telegraf";
import { startController } from "./startController.js";
import { authController } from "./authController.js";

export const setupControllers = (bot: Telegraf) => {
  bot.command("start", startController);
  bot.command('connect', authController.connectGoogle);
  bot.command('status', authController.checkConnection);


  bot.action('connect_google', authController.connectGoogle);

}

