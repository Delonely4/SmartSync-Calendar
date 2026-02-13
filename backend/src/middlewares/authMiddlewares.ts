import { Context } from 'telegraf';
import { pool } from '../database/db.js';


export const requireGoogleAuth = async (ctx: Context, next: () => Promise<void>) => {
  const telegramId = ctx.from?.id;

  if (!telegramId) {
    await ctx.reply('Error identifying user');
    return;
  }

  const result = await pool.query(
    'SELECT google_token FROM users WHERE telegram_id = $1',
    [telegramId]
  );

  const isConnected = result.rows.length > 0 && result.rows[0].google_token;

  if (!isConnected) {
    await ctx.reply(
      'Connect Google Calendar\n\n' +
      'Use command /connect',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Connect now', callback_data: 'connect_google' }
          ]]
        }
      }
    );
    return;
  }

  return next();
};