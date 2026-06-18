import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function loadTrackerState() {
  const { data, error } = await supabase
    .from("irc_tracker_state")
    .select("snapshot, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { snapshot: data.snapshot, updatedAt: data.updated_at };
}

export async function saveTrackerState(snapshot) {
  const { error } = await supabase
    .from("irc_tracker_state")
    .upsert({ id: 1, snapshot, updated_at: new Date().toISOString() });

  if (error) throw error;
  return true;
}


