-- Create tables
CREATE TABLE IF NOT EXISTS statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  total_votes INTEGER DEFAULT 0,
  agree_weight REAL DEFAULT 0,
  disagree_weight REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  choices JSONB NOT NULL,
  answer_index INTEGER NOT NULL,
  statement_id UUID NOT NULL REFERENCES statements(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  for_reasons JSONB NOT NULL,
  against_reasons JSONB NOT NULL,
  statement_id UUID NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
  UNIQUE(statement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_statements_created_at ON statements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_statement_id ON quiz(statement_id);
CREATE INDEX IF NOT EXISTS idx_summary_statement_id ON summary(statement_id);
