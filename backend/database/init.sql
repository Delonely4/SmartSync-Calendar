CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  avatar_id UUID,
  google_token JSONB,
  timezone VARCHAR(50) DEFAULT 'UTC',
  daily_report_time TIME DEFAULT '09:00:00',
  streak_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE calendars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  google_calendar_id TEXT NOT NULL,
  title VARCHAR(255),
  color_tag VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE 
)

CREATE TYPE task_status AS ENUM ('pending', 'completed', 'missed');

CREATE TABLE tasks_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
    google_event_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    deadline_at TIMESTAMP WITH TIME ZONE, 
    status task_status DEFAULT 'pending',
    is_manual BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE notify_type AS ENUM ('month_review', 'week_review', 'day_start', 'deadline_warning', 'pomodoro');

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    task_id UUID REFERENCES tasks_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notify_at TIMESTAMP WITH TIME ZONE NOT NULL,
    type notify_type NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE
);

CREATE TABLE reports_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    year INT NOT NULL,
    tasks_completed INT DEFAULT 0,
    tasks_missed INT DEFAULT 0,
    efficiency_rate FLOAT, 
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);