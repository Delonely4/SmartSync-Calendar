import { google } from 'googleapis';
import { logger } from '../utils/loggerUtils.js';
import { pool } from '../database/db.js';
import { googleAuthService } from './googleAuthService.js';
import type { ParsedEvent } from '../types/parsedEventInterface.js';

export const calendarSyncService = {
  async syncUserCalendar(telegramId: number, daysAhead: number = 7) {
  try {
    logger.info(`Starting calendar sync for user ${telegramId}`);

    const AuthClient = await googleAuthService.getAuthClientForUser(telegramId);
    const calendar = google.calendar({ version: 'v3', auth: AuthClient });

    const userResult = await pool.query('SELECT id FROM users WHERE telegram_id = $1', [telegramId]);

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const userId = userResult.rows[0].id;

    const calendarsResult = await pool.query(
      'SELECT id, google_calendar_id, title FROM calendars WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    if (calendarsResult.rows.length === 0) {
      logger.warn(`No active calendars found for user ${telegramId}`);
      return { synced: 0, calendars: 0 };
    }

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    let totalSynced = 0;

    for (const cal of calendarsResult.rows) {
      const events = await this.fetchEventsFromGoogle(
        calendar,
        cal.google_calendar_id,
        now,
        futureDate
      );
      logger.info(`Fetched ${events.length} events from calendar ${cal.title} for user ${telegramId}`);

      for(const event of events) {
        await this.saveEventToDb(event,cal.id,userId);
        totalSynced++;
      }
    }
    logger.info(`Sync completed for user ${telegramId}: ${totalSynced} events synced from ${calendarsResult.rows.length} calendars`);
    return { 
      synced: totalSynced, 
      calendars: calendarsResult.rows.length };
  } catch (error) {
    logger.error(`Calendar sync failed for user ${telegramId}`, error);
    throw error;
  }
}
}



