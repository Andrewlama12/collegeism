-- Enable Row Level Security on all tables
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE summary ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read statements
CREATE POLICY "Anyone can read statements"
ON statements FOR SELECT
USING (true);

-- Policy: Anyone can insert statements (you can restrict this later with auth)
CREATE POLICY "Anyone can create statements"
ON statements FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can update statements (needed for voting)
CREATE POLICY "Anyone can update statements"
ON statements FOR UPDATE
USING (true);

-- Policy: Everyone can read quiz questions
CREATE POLICY "Anyone can read quiz"
ON quiz FOR SELECT
USING (true);

-- Policy: Anyone can insert quiz (needed when creating statements)
CREATE POLICY "Anyone can create quiz"
ON quiz FOR INSERT
WITH CHECK (true);

-- Policy: Everyone can read summaries
CREATE POLICY "Anyone can read summary"
ON summary FOR SELECT
USING (true);

-- Policy: Anyone can insert summaries (needed when creating statements)
CREATE POLICY "Anyone can create summary"
ON summary FOR INSERT
WITH CHECK (true);

-- Note: No DELETE policies - nobody can delete data
