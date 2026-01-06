CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  avatar_id UUID,
  google_token JSONB,
  timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
  daily_report_time TIME DEFAULT '09:00:00',
  streak_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE calendars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  google_calendar_id TEXT NOT NULL,
  title VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE 
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7) DEFAULT '#808080',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_user_categories_name ON categories (user_id, name) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_system_categories_name ON categories (name) WHERE user_id IS NULL;


CREATE TYPE task_status AS ENUM ('pending', 'completed', 'missed', 'postponed');

CREATE TABLE tasks_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
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

CREATE TYPE notify_type AS ENUM ('month_review', 'week_review', 'day_start', 'deadline_warning', 'pomodoro', 'postpone_offering', 'reminder');

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
    tasks_postponed INT DEFAULT 0,
    efficiency_rate FLOAT, 
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, color_hex, is_system, user_id)
VALUES
  ('Работа', '#3498db', TRUE, NULL),
  ('Личное', '#2ecc71', TRUE, NULL),
  ('Учёба', '#f1c40f', TRUE, NULL),
  ('Спорт', '#e74c3c', TRUE, NULL)
ON CONFLICT DO NOTHING;