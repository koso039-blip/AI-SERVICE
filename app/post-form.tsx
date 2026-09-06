"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "answering">("idle");
  const [error, setError] = useState("");

  const busy = status !== "idle";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || busy) return;

    setStatus("saving");
    setError("");
    const { data, error } = await supabase
      .from("posts")
      .insert({ title: title.trim(), content: content.trim() })
      .select("id")
      .single();

    if (error || !data) {
      setStatus("idle");
      setError("등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setTitle("");
    setContent("");
    setStatus("answering");
    router.refresh();

    // AI 답변은 실패해도 글은 이미 올라간 상태라 조용히 넘어간다.
    try {
      await fetch("/api/ai-comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: data.id }),
      });
    } catch {
      // 무시
    }

    setStatus("idle");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="mb-10 border-2 border-black bg-white p-5 shadow-[5px_5px_0_0_#000]"
    >
      <h2 className="mb-4 text-base font-bold">질문 남기기</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        maxLength={100}
        className="mb-3 w-full border-2 border-black px-3 py-2 text-sm outline-none focus:bg-[#fbfbe8]"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="궁금한 내용을 적어주세요"
        maxLength={2000}
        rows={4}
        className="mb-3 w-full resize-none border-2 border-black px-3 py-2 text-sm outline-none focus:bg-[#fbfbe8]"
      />
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {status === "answering"
            ? "🤖 AI가 답변을 작성하고 있어요..."
            : "작성자: 익명 · 등록하면 AI가 답변을 달아줘요"}
        </span>
        <button
          type="submit"
          disabled={busy}
          className="border-2 border-black bg-[#c9f24d] px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50"
        >
          {status === "saving" ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}
