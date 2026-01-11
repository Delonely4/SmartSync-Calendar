import { Telegraf } from "telegraf";
import { config } from "./config/config.js";
import { pool } from "./database/db.js";
import { logger } from "./utils/loggerUtils.js";

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Привет! Я готов к работе. А ты?");
  logger.info(`User started the bot ${ctx.from.id}`);
});

export const startBot = async () => {
  try {
    await pool.query("SELECT NOW()");
    logger.info("Database connected");
    await bot.launch();
    logger.info("Bot launched");
  } catch (err) {
    logger.error("Unable to start bot", err);
    process.exit(1);
  }
};

startBot();

const stopBot = (signal: string) => {
  logger.info(`Received ${signal}. Stopping bot...`);
  bot.stop(signal);

  pool.end().then(() => {
    logger.info("Database pool closed.");
    process.exit(0);
  });
};

process.once("SIGINT", () => stopBot("SIGINT"));
process.once("SIGTERM", () => stopBot("SIGTERM"));
