import { google } from 'googleapis';
import { config } from '../config/config.js';
import { pool } from '../database/db.js';
import { logger } from '../utils/loggerUtils.js';

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

export const googleAuthService = {

  getAuthUrl(telegramId: number): string {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'ttps://www.googleapis.com/auth/calendar.events'
      ],
      state: telegramId.toString(),
      prompt: 'consent',
    });
    logger.info(`Generated auth URL for user ${telegramId}`);
    return authUrl;
  },

  async exchangeCodeForTokens(code: string) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      logger.info('Successfully exchange code for tokens');
      return tokens;
    } catch  (error) {
      logger.error('Failed to exchange code for tokens', error);
      throw new Error('OAuth token exchange failed');
    }
  },

  async refreshAccessToken(refreshToken: string) {
    try {
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await oauth2Client.refreshAccessToken();
      logger.info('Successfully regreshed access token');
      return credentials;
    } catch (error) {
      logger.error('Failed to refresh access token', error);
      throw new Error('Token refresh failed')
    }
  },

  async saveTokens(telegramId: number, tokens: any) {
    const query = `
    UPDATE users
    SET google_token = $1
    WHERE telegram_id = $2
    RETURNING id 
    `;

    try {
      const result = await pool.query(query, [JSON.stringify(tokens), telegramId]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      logger.info(`Saved Google tokens for user ${telegramId}`);
      return result.rows[0].id;
    } catch (error) {
      logger.error('Failed to save tokens to database', error);
      throw error;
    }
  },

  async getAuthClientForUser(telegramId: number) {
    const query = 'SELECT google_token FROM users WHERE telegram_id = $1';
    const result = await pool.query(query, [telegramId]);

    if (result.rows.length === 0 || !result.rows[0].google_token) {
      throw new Error('User not authorized with Google');
    }

    const tokens = result.rows[0].google_token;

    const client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URI
    );

    client.setCredentials(tokens);

    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      const newTokens = await this.refreshAccessToken(tokens.refresh_token);
      await this.saveTokens(telegramId, newTokens);
      client.setCredentials(newTokens);
    }

    return client;
  }



}