import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate URL format
if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseUrl.match(/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/)) {
  throw new Error(`Invalid Supabase URL format. Expected https://[project-id].supabase.co but got ${supabaseUrl}`);
}

// Validate key format
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
if (!supabaseAnonKey.startsWith('eyJ')) {
  throw new Error('Invalid Supabase anon key format. Should start with "eyJ"');
}

console.log("Initializing Supabase client with:");
console.log("URL:", supabaseUrl);
console.log("Key:", supabaseAnonKey.slice(0, 8) + "...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);