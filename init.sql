CREATE TABLE asset_event (
  event_id VARCHAR(36) PRIMARY KEY,
  event_type VARCHAR(32) NOT NULL,
  content_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  event_time timestamp DEFAULT current_timestamp
);