# Collegeism Setup Guide

## Prerequisites

1. Node.js (v18 or higher)
2. A Supabase account (https://supabase.com)

## Database Setup

### 1. Create a Supabase Project

1. Go to https://app.supabase.com
2. Create a new project
3. Wait for the database to be provisioned

### 2. Run Migrations

You can run the migrations in two ways:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - First: `supabase/migrations/20250929000000_initial_schema.sql`
   - Then: `supabase/migrations/20250929_fix_relationships.sql`

#### Option B: Using Supabase CLI
```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-key-here
```

Get these values from:
- Supabase URL and Key: Project Settings → API → Project URL and anon/public key
- OpenAI API Key: https://platform.openai.com/api-keys (needed for AI features)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Database Schema

### Tables

- **statements**: Main content items that users vote on
  - `id` (UUID): Primary key
  - `text` (TEXT): The statement content
  - `created_at` (TIMESTAMP): When the statement was created
  - `total_votes` (INTEGER): Total number of votes
  - `agree_weight` (REAL): Weighted sum of agree votes
  - `disagree_weight` (REAL): Weighted sum of disagree votes

- **quiz**: Comprehension questions for each statement
  - `id` (UUID): Primary key
  - `question` (TEXT): The quiz question
  - `choices` (JSONB): Array of answer choices
  - `answer_index` (INTEGER): Index of correct answer
  - `statement_id` (UUID): Foreign key to statements

- **summary**: AI-generated summaries of arguments
  - `id` (UUID): Primary key
  - `for_reasons` (JSONB): Array of reasons supporting the statement
  - `against_reasons` (JSONB): Array of reasons against the statement
  - `statement_id` (UUID): Foreign key to statements (unique)

## Troubleshooting

### "Page not found" when clicking statements
- Make sure migrations are run correctly
- Check that `.env.local` has correct Supabase credentials
- Verify the Supabase tables exist by checking the Table Editor in Supabase Dashboard

### Supabase connection errors
- Ensure your Supabase URL matches the format: `https://[project-id].supabase.co`
- Verify the anon key starts with `eyJ`
- Check that RLS (Row Level Security) policies allow read/write access

### No statements appearing
- You need to create statements using the create API endpoint
- Or manually insert test data via Supabase SQL Editor

## Creating Test Data

You can create test statements via the API:

```bash
curl -X POST http://localhost:3000/api/statements/create \
  -H "Content-Type: application/json" \
  -d '{"text": "Your statement here"}'
```

Note: This requires the OpenAI API key to be configured for generating quiz questions.
