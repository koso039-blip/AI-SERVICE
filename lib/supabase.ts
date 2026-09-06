import { createClient } from "@supabase/supabase-js";

export type Comment = {
  id: number;
  content: string;
  created_at: string;
  is_ai: boolean;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  comments: Comment[];
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
