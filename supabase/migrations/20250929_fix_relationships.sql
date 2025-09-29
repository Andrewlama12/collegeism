-- Drop existing tables if they exist
DROP TABLE IF EXISTS summary;
DROP TABLE IF EXISTS quiz;
DROP TABLE IF EXISTS statements;

-- Create statements table first (it's referenced by others)
CREATE TABLE statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_votes INTEGER DEFAULT 0,
    agree_weight REAL DEFAULT 0,
    disagree_weight REAL DEFAULT 0
);

-- Create quiz table (singular) with proper foreign key
CREATE TABLE quiz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    choices JSONB NOT NULL,
    answer_index INTEGER NOT NULL,
    statement_id UUID NOT NULL REFERENCES statements(id) ON DELETE CASCADE
);

-- Create summary table (singular) with proper foreign key
CREATE TABLE summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    for_reasons JSONB NOT NULL,
    against_reasons JSONB NOT NULL,
    statement_id UUID NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
    UNIQUE(statement_id)
);

-- Create indexes for better performance
CREATE INDEX idx_quiz_statement_id ON quiz(statement_id);
CREATE INDEX idx_summary_statement_id ON summary(statement_id);
CREATE INDEX idx_statements_created_at ON statements(created_at DESC);
