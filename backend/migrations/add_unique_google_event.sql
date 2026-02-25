ALTER TABLE tasks_events 
ADD CONSTRAINT unique_google_event_id UNIQUE (google_event_id);
