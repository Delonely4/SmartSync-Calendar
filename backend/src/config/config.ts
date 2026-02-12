import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `CRITICAL ERROR: Environment variable "${key}" is missing.`
    );
  }

  return value;
};

const getEnvNum = (key: string, defaultValue: number): number => {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`ERROR: Variable "${key}" must be a number.`);
  }
  return parsed;
};

export const config = {
  BOT_TOKEN: getEnvVar("BOT_TOKEN"),

  DB_HOST: getEnvVar("DB_HOST"),
  DB_PORT: getEnvNum("DB_PORT", 5432),
  DB_USER: getEnvVar("DB_USER"),
  DB_NAME: getEnvVar("DB_NAME"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),

  GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getEnvVar("GOOGLE_REDIRECT_URI"),

  NODE_ENV: process.env.NODE_ENV || "development",
  EXPRESS_PORT: getEnvNum("EXPRESS_PORT", 3000)
};
