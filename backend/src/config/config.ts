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

  NODE_ENV: process.env.NODE_ENV || "development",
};
