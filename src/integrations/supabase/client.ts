// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using direct values for stability across all environments
const SUPABASE_URL = "https://heqawcwnrhubmranebox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlcWF3Y3ducmh1Ym1yYW5lYm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODAyODUsImV4cCI6MjA4MjY1NjI4NX0.c3qJg60Y-8EhehPMp2AmFI7V7HruVU4KOHfU6EqkvOk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});