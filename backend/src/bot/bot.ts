import { Telegraf } from "telegraf";
import { config } from "../config/config.js";

const bot = new Telegraf(config.BOT_TOKEN);
