import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";
import { logger } from "../utils/loggerUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, "../../database/init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    logger.info("Reading initialization SQL script...");

    await pool.query(sql);

    logger.info("Database tables created successfully");
  } catch (err) {
    logger.error("Failed to initialize database", err);
  } finally {
    await pool.end();
  }
};

initDb();
