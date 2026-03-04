import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
    "Survey responses will not be saved."
  );
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/*
  saveResponse — inserts one completed module response.

  Expects a shape matching the survey_responses table:
  {
    session_id    : string (UUID)
    module_id     : "phishing" | "tailgating" | "pretexting"
    ts_start      : ISO string
    ts_end        : ISO string
    pre_survey    : object  (question answers keyed by question id)
    post_survey   : object
    module_metrics: object  (score, ending, etc. from the game store)
  }

  Returns { data, error }.
*/
export async function saveResponse(payload) {
  if (!supabase) {
    console.warn("[supabase] Client not initialised. Skipping save.");
    return { data: null, error: new Error("Supabase not configured") };
  }

  const { data, error } = await supabase
    .from("survey_responses")
    .insert([payload]);

  if (error) {
    console.error("[supabase] Insert error:", error.message);
  }

  return { data, error };
}

/*
──────────────────────────────────────────────
  SUPABASE SETUP SQL  (run once in the Supabase SQL editor)
──────────────────────────────────────────────

-- 1. Create the table
create table survey_responses (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz default now(),
  session_id     text not null,
  module_id      text not null,
  ts_start       timestamptz,
  ts_end         timestamptz,
  pre_survey     jsonb,
  post_survey    jsonb,
  module_metrics jsonb
);

-- 2. Enable RLS
alter table survey_responses enable row level security;

-- 3. Allow anonymous inserts only (no reads, no deletes via anon key)
create policy "anon insert only"
  on survey_responses
  for insert
  to anon
  with check (true);

──────────────────────────────────────────────
*/