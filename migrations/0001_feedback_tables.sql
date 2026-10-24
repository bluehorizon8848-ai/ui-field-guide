-- UI Field Guide · Feedback & Feature Request Schema
-- Database: ufg-feedback-db
-- Target: Cloudflare D1

CREATE TABLE IF NOT EXISTS pattern_feedback (
  feedback_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  feedback_type TEXT NOT NULL,
  pattern_id TEXT NOT NULL,
  vote TEXT NOT NULL,
  reason TEXT,
  optional_comment TEXT,
  locale TEXT NOT NULL,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_pattern_feedback_pattern ON pattern_feedback(pattern_id);
CREATE INDEX IF NOT EXISTS idx_pattern_feedback_created ON pattern_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_pattern_feedback_vote ON pattern_feedback(vote);

CREATE TABLE IF NOT EXISTS feature_request (
  request_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  request_type TEXT NOT NULL,
  query TEXT,
  pattern_name TEXT NOT NULL,
  use_case TEXT,
  reference_url TEXT,
  locale TEXT NOT NULL,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_feature_request_created ON feature_request(created_at);
CREATE INDEX IF NOT EXISTS idx_feature_request_type ON feature_request(request_type);
