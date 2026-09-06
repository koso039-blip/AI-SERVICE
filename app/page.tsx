"use client";

import { useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const SEED: Post[] = [
  {
    id: 3,
    title: "탄수화물 줄인 식단도 추천받을 수 있나요?",
    content:
      "저탄고지로 먹고 있는데, 개인화 추천이 제 식습관까지 반영해주는지 궁금합니다.",
    createdAt: "2026-09-05 18:20",
  },
  {
    id: 2,
    title: "알레르기 정보는 어디에 입력하나요?",
    content: "견과류 알레르기가 있어서 추천 식단에서 빼고 싶어요.",
    createdAt: "2026-09-04 11:02",
  },
  {
    id: 1,
    title: "하루 몇 끼 기준으로 짜주나요?",
    content: "간헐적 단식 중이라 2끼 기준으로도 받아볼 수 있는지 알고 싶습니다.",
    createdAt: "2026-09-03 09:47",
  },
];

function now() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosts([
      {
        id: posts.length ? posts[0].id + 1 : 1,
        title: title.trim(),
        content: content.trim(),
        createdAt: now(),
      },
      ...posts,
    ]);
    setTitle("");
    setContent("");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <header className="mb-10">
        <span className="inline-block border-2 border-black bg-[#c9f24d] px-2 py-0.5 text-xs font-bold">
          Q&amp;A
        </span>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          AI 식단 서비스 <span aria-hidden>🥗</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          개인화된 식단에 대해 무엇이든 물어보세요. 로그인 없이 익명으로 남길 수
          있어요.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="mb-10 border-2 border-black bg-white p-5 shadow-[5px_5px_0_0_#000]"
      >
        <h2 className="mb-4 text-base font-bold">질문 남기기</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="mb-3 w-full border-2 border-black px-3 py-2 text-sm outline-none focus:bg-[#fbfbe8]"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="궁금한 내용을 적어주세요"
          rows={4}
          className="mb-3 w-full resize-none border-2 border-black px-3 py-2 text-sm outline-none focus:bg-[#fbfbe8]"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">작성자: 익명</span>
          <button
            type="submit"
            className="border-2 border-black bg-[#c9f24d] px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            등록
          </button>
        </div>
      </form>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-bold">전체 질문 {posts.length}</h2>
        <span className="text-xs text-neutral-400">
          새로고침하면 초기화됩니다 (저장 안 함)
        </span>
      </div>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="border border-black bg-[#ffd9ec] px-1.5 py-0.5 font-bold">
                Q&amp;A
              </span>
              <span className="text-neutral-400">#{post.id}</span>
            </div>
            <h3 className="mt-2 font-bold">{post.title}</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">
              {post.content}
            </p>
            <p className="mt-3 text-xs text-neutral-400">
              익명 · {post.createdAt}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
