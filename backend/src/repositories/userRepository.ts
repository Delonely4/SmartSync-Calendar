import { pool } from "../database/db.js";
import type { IUser } from "../types/userInterface.js";

export const userRepository = {
  async upsertUser(user: IUser): Promise<IUser> {
    const query = `
      INSERT INTO users (telegram_id, google_token, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (telegram_id) 
      DO UPDATE SET telegram_id = EXCLUDED.telegram_id
      RETURNING *;
    `;
    const res = await pool.query(query, [user.telegram_id, null]);
    return res.rows[0];
  },

  async findByTelegramId(telegramId: number): Promise<IUser | null> {
    const query = `SELECT * FROM users WHERE telegram_id = $1`;
    const res = await pool.query(query, [telegramId]);
    return res.rows[0] || null;
  },

  async updateGoogleToken(telegramId: number, token: any): Promise<void> {
    const query = `
      UPDATE users
      SET google_token = $1
      WHERE telegram_id = $2
    `;
    await pool.query(query, [token, telegramId]);
  }
};
