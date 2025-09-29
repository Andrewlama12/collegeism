import { supabase } from './supabase';
import { initialStatements } from './initial-data';

// Types
export type Statement = {
  id: string;
  text: string;
  created_at: string;
  total_votes: number;
  agree_weight: number;
  disagree_weight: number;
};

export type Quiz = {
  id: string;
  question: string;
  choices: string[];
  answer_index: number;
  statement_id: string;
};

export type Summary = {
  id: string;
  for_reasons: string[];
  against_reasons: string[];
  statement_id: string;
};

class Store {
  // Expose Supabase client for direct access
  supabase = supabase;

  // Initialize store with sample data if empty
  async init() {
    console.log("Checking if database needs initialization...");
    const { count, error } = await supabase
      .from('statements')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("Error checking statements:", error);
      throw error;
    }

    console.log(`Found ${count} existing statements`);

    if (count === 0) {
      console.log("Initializing database with sample data...");
      for (const statement of initialStatements) {
        console.log("Creating statement:", statement.text);
        
        // Create statement with initial data
        const { data: newStatement, error: stError } = await supabase
          .from('statements')
          .insert({
            text: statement.text,
            created_at: statement.createdAt,
            total_votes: statement.totalVotes,
            agree_weight: statement.agreeWeight,
            disagree_weight: statement.disagreeWeight
          })
          .select()
          .single();

        if (stError) {
          console.error("Error creating statement:", stError);
          throw stError;
        }
        if (!newStatement) {
          const err = new Error("No statement created");
          console.error(err);
          throw err;
        }

        console.log("Created statement:", newStatement);

        // Add quizzes
        if (statement.quiz) {
          for (const q of statement.quiz) {
            console.log("Creating quiz:", q.question);
            const { error: qError } = await this.createQuiz({
              question: q.question,
              choices: q.choices,
              answer_index: q.answerIndex,
              statement_id: newStatement.id
            });
            if (qError) {
              console.error("Error creating quiz:", qError);
              throw qError;
            }
          }
        }

        // Add summary
        if (statement.summary) {
          console.log("Creating summary for statement:", newStatement.id);
          const { error: sError } = await this.createSummary({
            for_reasons: statement.summary.forReasons,
            against_reasons: statement.summary.againstReasons,
            statement_id: newStatement.id
          });
          if (sError) {
            console.error("Error creating summary:", sError);
            throw sError;
          }
        }
      }
      console.log("Database initialization complete");
    }
  }

  // Statement operations
  async getStatements() {
    console.log("Fetching all statements...");
    const { data, error } = await supabase
      .from('statements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching statements:", error);
      throw error;
    }

    console.log("Fetched statements:", data);
    return data || [];
  }

  async getStatement(id: string) {
    const { data: statement, error } = await supabase
      .from('statements')
      .select('*, quiz(*), summary(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching statement:", error);
      throw error;
    }

    return {
      ...statement,
      quiz: statement.quiz || [],
      summary: statement.summary
    };
  }

  async createStatement(text: string) {
    const { data, error } = await supabase
      .from('statements')
      .insert({
        text,
        created_at: new Date().toISOString(),
        total_votes: 0,
        agree_weight: 0,
        disagree_weight: 0
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating statement:", error);
      throw error;
    }
    return data;
  }

  async updateStatement(id: string, data: {
    total_votes?: number;
    agree_weight?: number;
    disagree_weight?: number;
  }) {
    const { data: updated, error } = await supabase
      .from('statements')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating statement:", error);
      throw error;
    }
    return updated;
  }

  // Quiz operations
  async getQuizzes(statement_id: string) {
    const { data, error } = await supabase
      .from('quiz')
      .select('*')
      .eq('statement_id', statement_id);

    if (error) {
      console.error("Error fetching quizzes:", error);
      throw error;
    }
    return data || [];
  }

  async createQuiz(data: {
    question: string;
    choices: string[];
    answer_index: number;
    statement_id: string;
  }) {
    return supabase
      .from('quiz')
      .insert(data)
      .select()
      .single();
  }

  // Summary operations
  async getSummary(statement_id: string) {
    const { data, error } = await supabase
      .from('summary')
      .select('*')
      .eq('statement_id', statement_id)
      .single();

    if (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
    return data;
  }

  async createSummary(data: {
    for_reasons: string[];
    against_reasons: string[];
    statement_id: string;
  }) {
    return supabase
      .from('summary')
      .insert(data)
      .select()
      .single();
  }
}

// Export singleton instance
export const store = new Store();