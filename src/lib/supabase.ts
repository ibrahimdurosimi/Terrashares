import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// These should be configured via the AI Studio Secrets panel
// and available as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

console.log("Supabase URL:", supabaseUrl);
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
