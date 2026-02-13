import { Context } from 'telegraf';
import { googleAuthService } from '../services/googleAuthService.js';
import { logger } from '../utils/loggerUtils.js';

export const authController = {

  async connectGoogle(ctx: Context) {
    try {
      const telegramId = ctx.from!.id;
      const authUrl = googleAuthService.getAuthUrl(telegramId);

      await ctx.reply(
        'Google Calendar connection\n\n' +
        'To sync your tasks, click the button below and grant access to your Google Calendar.\n\n' +
        'After authorization, return to this chat.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: 'Connect Google Calendar', url: authUrl }
            ]]
          }
        }
      );

      logger.info(`User ${telegramId} initiated Google auth`);
    } catch (error) {
      logger.error('Error in connectGoogle:', error);
      await ctx.reply('Error. Please try again later.');
    }
  },

  async checkConnection(ctx: Context) {
    try {
      const telegramId = ctx.from!.id;
      
      const { pool } = await import('../database/db.js');
      const result = await pool.query(
        'SELECT google_token FROM users WHERE telegram_id = $1',
        [telegramId]
      );

      const isConnected = result.rows.length > 0 && result.rows[0].google_token;

      if (isConnected) {
        await ctx.reply('Google Calendar connected');
      } else {
        await ctx.reply(
          'Google Calendar not connected\n\n' +
          'Use /connect to connect'
        );
      }
    } catch (error) {
      logger.error('Error checking connection:', error);
      await ctx.reply('Error checking connection');
    }
  },
};