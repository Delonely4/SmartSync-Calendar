import { google } from 'googleapis';
import { logger } from '../utils/loggerUtils.js';
import { pool } from '../database/db.js';
import { googleAuthService } from './googleAuthService.js';

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
  },

  async fetchEventsFromGoogle(
  calendar: any,
  calendarId: string,
  timeMin: Date,
  timeMax: Date
  ) {
  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
    });

    return response.data.items || [];
  } catch (error) {
    logger.error(`Failed to fetch events from Google Calendar ${calendarId}`, error);
    return [];
  }
    },

  parseDeadlineFromTitle(title: string) : { cleanTitle: string; deadline: Date | null } {
  const deadlineRegex = /\[DEADLINE\s+(\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?)\]/i;
  const match = title.match(deadlineRegex);

  if(!match) {
    return { cleanTitle: title, deadline: null };
  }

  const deadlineStr = match[1]!;
  let deadline: Date | null = null;

  try {
    deadline = new Date(deadlineStr);

    if(isNaN(deadline.getTime())) {
      logger.warn(`Invalid deadline format in title: ${title}`);
      deadline = null;
    }
  } catch (error) {
    logger.warn(`Failed to parse deadline from title: ${title}`, error);
    deadline = null;
  }

  const cleanTitle = title.replace(deadlineRegex, '').trim();

  return { cleanTitle, deadline };
},

  async getCategoryByCalendarName(calendarTitle: string, userId: number): Promise<string | null> {
  const mapping: { [key: string]: string } = {
    'work': 'Работа',
    'работа': 'Работа',
    'office': 'Работа',
    'офис': 'Работа',
    'job': 'Работа',
    
    'personal': 'Личное',
    'личное': 'Личное',
    'семья': 'Личное',        
    'family': 'Личное',
    'день рождения': 'Личное', 
    'birthday': 'Личное',
    'home': 'Личное',
    
    'study': 'Учёба',
    'учёба': 'Учёба',
    'учеба': 'Учёба',
    'education': 'Учёба',
    'обучение': 'Учёба',
    'university': 'Учёба',
    'университет': 'Учёба',
    
    'sport': 'Спорт',
    'спорт': 'Спорт',
    'fitness': 'Спорт',
    'фитнес': 'Спорт',
    'gym': 'Спорт',
    'зал': 'Спорт',
    'тренировка': 'Спорт',

  };

  const lowerTitle = calendarTitle.toLowerCase();

  for (const [keyword, categoryName] of Object.entries(mapping)) {
    if (lowerTitle.includes(keyword)) {
      const result = await pool.query(
        `SELECT id FROM categories
        WHERE name = $1 AND (user_id = $2 OR is_system = true)
        LIMIT 1`,
        [categoryName, userId]
      );
      
      if (result.rows.length > 0) {
        return result.rows[0].id;
      }
    }


}

return null;

},

async saveEventToDb(event: any, calendarDbId: string, userId: number) {
  try {
    const { cleanTitle, deadline } = this.parseDeadlineFromTitle(event.summary || 'Без названия');
    
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    if (event.start.dateTime) {

      startTime = new Date(event.start.dateTime);
      endTime = event.end?.dateTime ? new Date(event.end.dateTime) : startTime;
} else if (event.start.date) {
      startTime = new Date(event.start.date + 'T00:00:00');
      endTime = event.end?.date ? new Date(event.end.date + `T23:59:59`) : startTime;
}

const calendarInfo = await pool.query(
  'SELECT title FROM calendars WHERE id = $1',
  [calendarDbId]
);
const calendarTitle = calendarInfo.rows[0]?.title || '';
const categoryId = await this.getCategoryByCalendarName(calendarTitle, userId);

const query = `
INSERT INTO tasks_events (
  calendar_id,
  category_id,
  google_event_id,
  title,
  description,
  start_time,
  end_time,
  deadline_at,
  status,
  is_manual,
  created_at
)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,'pending', false, NOW())
  ON CONFLICT (google_event_id) 
  DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    deadline_at = EXCLUDED.deadline_at,
    category_id = EXCLUDED.category_id
  RETURNING id
`;

await pool.query(query, [
  calendarDbId,
  categoryId,
  event.id,
  cleanTitle,
  event.description || null,
  startTime,
  endTime,
  deadline,
]);
  } catch (error) {
    logger.error(`Failed to save event ${event.id} to DB for user ${userId}`, error);
  }
},
}
