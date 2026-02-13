import express from 'express';
import { config } from '../config/config.js';
import { googleAuthService } from '../services/googleAuthService.js';
import { logger } from '../utils/loggerUtils.js';
import { bot } from '../bot/bot.js';

const app = express();

app.get('/auth/google/callback', async(req, res) => {

  const { code, state, error } = req.query;

  if (error) {
    logger.warn(`OAuth error: ${error}`);
    res.send(`
      <html>
        <body>
          <h1>Authentication Failed</h1>
          <p>You declined the Google authentication request.</p>
          <a href="/">Go back to bot and try again</a>
        </body>
      </html>
    `);
    return;
  }

  try {
    const telegramId = parseInt(state as string)
    const tokens = await googleAuthService.exchangeCodeForTokens(code as string);
    await googleAuthService.saveTokens(telegramId, tokens);

    const { pool } = await import('../database/db.js');
    await pool.query(`
      INSERT INTO calendars (user_id, google_calendar_id, title, is_active)
      SELECT id, 'primary', 'Main Calendar', true
      FROM users WHERE telegram_id = $1
      ON CONFLICT DO NOTHING
      `, [telegramId]);

      await bot.telegram.sendMessage(telegramId, 
        'Google authentication successful!\n\n'+
        'Now I will sync your calendar events.\n'+
        'Use /tasks to see your tasks for today.');

        logger.info(`Successfully connected Google calendar for user ${telegramId}`);
        res.send(`
          <html>
            <body>
              <h1>Connection Successful</h1>
              <p>Comeback to Telegram the bot is ready.</p>
              <script>setTimeout(() => window.close(), 3000)</script>
            </body>
          </html>
        `);
  } catch (error) {
    logger.error('Error handling OAuth callback', error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Server Error</h1>
          <p>Something went wrong. Please try again.</p>
        </body>
      </html>
    `);
  }

});

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export const startOAuthServer = () => {
  app.listen(config.EXPRESS_PORT, () => {
    logger.info(`OAuth server is running on port ${config.EXPRESS_PORT}`);
    logger.info(`Callback URL: ${config.GOOGLE_REDIRECT_URI}`);
  });
}

