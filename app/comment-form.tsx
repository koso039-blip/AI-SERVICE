"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CommentForm({ postId }: { postId: number }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || saving) return;

    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, content: content.trim() });
    setSaving(false);

    if (error) {
      setError("댓글 등록에 실패했어요.");
      return;
    }
    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글 달기"
        maxLength={1000}
        aria-label="댓글 내용"
        className="min-w-0 flex-1 border-2 border-black px-2 py-1.5 text-xs outline-none focus:bg-[#fbfbe8]"
      />
      <button
        type="submit"
        disabled={saving}
        className="shrink-0 border-2 border-black bg-[#ffd9ec] px-3 py-1.5 text-xs font-bold active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
      >
        {saving ? "등록 중" : "등록"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
