import { cleanEnv, str, num } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const config = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  DB_HOST: str(),
  DB_PORT: num({ default: 5432 }),
  DB_USER: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),

  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
});
