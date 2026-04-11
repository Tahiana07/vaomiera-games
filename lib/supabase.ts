import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const supabaseUrl = "https://lfzqefuhybazyfwauxqu.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmenFlZnVoeWJhenlmd2F1eHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NjY4MTksImV4cCI6MjA5MTQ0MjgxOX0.sjmzi3xrERQGKSPCfPDd21FvHo1YNmw6YR9nJ3AjMFI";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env variables missing");
  }

  return createClient(supabaseUrl, supabaseKey);
}