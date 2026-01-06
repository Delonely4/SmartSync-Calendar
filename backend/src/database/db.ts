import pg from "pg";
import { config } from "../config/config.js";
import { logger } from "../utils/loggerUtils.js";

const { Pool } = pg;

export const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

pool.on("error", (err, _client) => {
  logger.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool
  .connect()
  .then((client) => {
    logger.info("Database connected successfully");
    client.release();
  })
  .catch((err) => {
    logger.error("Database connection failed", err);
  });
