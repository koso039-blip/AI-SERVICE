import { createClient } from "@supabase/supabase-js";

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
