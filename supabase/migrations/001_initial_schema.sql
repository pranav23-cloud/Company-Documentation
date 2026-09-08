-- ============================================================
-- MY PLC LEARNING JOURNEY — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- Categories table (extensible)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL DEFAULT '⚙️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Learning days table
CREATE TABLE IF NOT EXISTS learning_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Learning topics table (multiple topics per day)
CREATE TABLE IF NOT EXISTS learning_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_day_id UUID NOT NULL REFERENCES learning_days(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_days_date ON learning_days(date DESC);
CREATE INDEX IF NOT EXISTS idx_learning_days_status ON learning_days(status);
CREATE INDEX IF NOT EXISTS idx_learning_topics_day_id ON learning_topics(learning_day_id);
CREATE INDEX IF NOT EXISTS idx_learning_topics_category ON learning_topics(category);

-- Auto-update updated_at on learning_days
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS learning_days_updated_at ON learning_days;
CREATE TRIGGER learning_days_updated_at
  BEFORE UPDATE ON learning_days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Seed default categories
-- ============================================================
INSERT INTO categories (name, emoji) VALUES
  ('PLC Programming', '⚙️'),
  ('Electrical', '🔌'),
  ('Industrial Automation', '🏭'),
  ('Sensors', '📡'),
  ('CNC Automation', '🤖'),
  ('Ladder Logic', '🧠'),
  ('Timers & Counters', '⏱️'),
  ('Hardware', '🔧')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: categories
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- PUBLIC READ: published learning days only
CREATE POLICY "Public can read published learning days"
  ON learning_days FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- ADMIN READ: all learning days (including drafts)
CREATE POLICY "Authenticated users can read all learning days"
  ON learning_days FOR SELECT
  TO authenticated
  USING (true);

-- PUBLIC READ: topics for published days
CREATE POLICY "Public can read topics of published days"
  ON learning_topics FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM learning_days
      WHERE learning_days.id = learning_topics.learning_day_id
      AND learning_days.status = 'published'
    )
  );

-- ADMIN READ: all topics
CREATE POLICY "Authenticated users can read all topics"
  ON learning_topics FOR SELECT
  TO authenticated
  USING (true);

-- ADMIN WRITE: learning_days
CREATE POLICY "Authenticated users can insert learning days"
  ON learning_days FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update learning days"
  ON learning_days FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete learning days"
  ON learning_days FOR DELETE
  TO authenticated
  USING (true);

-- ADMIN WRITE: learning_topics
CREATE POLICY "Authenticated users can insert topics"
  ON learning_topics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update topics"
  ON learning_topics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete topics"
  ON learning_topics FOR DELETE
  TO authenticated
  USING (true);

-- ADMIN WRITE: categories
CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);
