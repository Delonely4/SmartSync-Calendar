import { bot } from "./bot/bot.js";
import { setupControllers } from "./controllers/root.js";
import { pool } from "./database/db.js";
import { logger } from "./utils/loggerUtils.js";

bot.start((ctx) => {
  ctx.reply("Привет! Я готов к работе. А ты?");
  if (ctx.from) {
    logger.info(`User started the bot ${ctx.from.id}`);
  }
});

const startBot = async () => {
  try {
    await pool.query("SELECT NOW()");
    logger.info("Database connected");
    setupControllers(bot);
    await bot.launch();
    logger.info("Bot launched successfully");
  } catch (err) {
    logger.error("Failed to start bot", err);
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
