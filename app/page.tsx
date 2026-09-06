import { supabase, type Post } from "@/lib/supabase";
import PostForm from "./post-form";
import CommentForm from "./comment-form";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default async function Home() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, comments(id, content, created_at)")
    .order("id", { ascending: false })
    .order("id", { ascending: true, referencedTable: "comments" });

  const posts: Post[] = data ?? [];

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

      <PostForm />

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-bold">전체 질문 {posts.length}</h2>
        <span className="text-xs text-neutral-400">최신순</span>
      </div>

      {error && (
        <p className="border-2 border-black bg-white p-4 text-sm text-red-600">
          목록을 불러오지 못했어요.
        </p>
      )}

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
              익명 · {formatDate(post.created_at)}
            </p>

            <div className="mt-4 border-t-2 border-dashed border-neutral-300 pt-3">
              <p className="text-xs font-bold text-neutral-500">
                댓글 {post.comments.length}
              </p>
              <ul className="mt-2 space-y-2">
                {post.comments.map((comment) => (
                  <li key={comment.id} className="bg-[#f6f6f0] px-3 py-2">
                    <p className="whitespace-pre-wrap text-xs text-neutral-700">
                      {comment.content}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-400">
                      익명 · {formatDate(comment.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
              <CommentForm postId={post.id} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
