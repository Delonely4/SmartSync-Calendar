import { Context } from "telegraf";

export const startController = async (ctx: Context) => {
  try {
    const name = ctx.from?.first_name || "User";
    await ctx.reply(`Привет, ${name}! Бот работает.`);
    // await saveUser(ctx.from);
  } catch (error) {
    console.error("Error in start command", error);
    await ctx.reply("Что-то пошло не так.");
  }
};
