# Collegeism — Understanding > Noise

A platform for weighted voting on opinion statements, where vote weight is earned by passing comprehension checks. Users can see AI-generated summaries of both sides of an argument.

## Features

- **Weighted Voting System**: Votes are weighted based on comprehension quiz performance
- **AI-Generated Quizzes**: Each statement has 2-3 multiple-choice questions to verify understanding
- **Dual-Side Summaries**: AI-generated reasons for and against each statement
- **Three Curated Feeds**: Most Popular, 50/50 Debates, and New/Hot

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 for quiz and summary generation
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account
- An OpenAI API key (for creating new statements)

### Setup

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
```

3. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the migrations in the SQL Editor:
     - `supabase/migrations/20250929000000_initial_schema.sql`
     - `supabase/migrations/20250929_fix_relationships.sql`

4. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Schema

### Tables

- **statements**: Opinion statements that users vote on
- **quiz**: Comprehension questions for each statement
- **summary**: AI-generated reasons for and against each statement

All tables use UUIDs as primary keys and have proper foreign key relationships with cascading deletes.

## API Routes

- `GET /api/statements` - Fetch all statements with metadata
- `GET /api/statements/[id]` - Fetch a single statement with quiz and summary
- `POST /api/statements/create` - Create a new statement (requires OpenAI API key)
- `POST /api/vote` - Submit a vote with quiz answers

## Troubleshooting

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting tips.

## Recent Fixes (Sept 29, 2025)

- ✅ Migrated from SQLite to Supabase
- ✅ Fixed table naming (quiz/summary vs quizzes/summaries)
- ✅ Updated all API routes to use Supabase
- ✅ Fixed statement detail page showing "not found"
- ✅ Fixed voting functionality with proper database updates
