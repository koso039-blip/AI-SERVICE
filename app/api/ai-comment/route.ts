import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

const SYSTEM_PROMPT = `너는 개인화된 식단을 추천하는 "AI 식단 서비스"의 Q&A 게시판 도우미다.
사용자의 질문에 한국어로 친절하고 간결하게 답한다.

규칙:
- 3문장 이내로 답한다.
- 확실하지 않은 것은 아는 척하지 않는다.
- 질병 진단이나 치료 조언은 하지 않고, 필요하면 전문가 상담을 권한다.
- 인사말이나 서론 없이 바로 본론을 말한다.`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  const { postId } = await request.json();
  if (typeof postId !== "number") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("title, content")
    .eq("id", postId)
    .single();

  if (!post) {
    return NextResponse.json({ error: "post_not_found" }, { status: 404 });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            parts: [{ text: `제목: ${post.title}\n내용: ${post.content}` }],
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    console.error("Gemini 호출 실패", res.status, await res.text());
    return NextResponse.json({ error: "gemini_failed" }, { status: 502 });
  }

  const body = await res.json();
  const answer: string | undefined =
    body?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer?.trim()) {
    return NextResponse.json({ error: "empty_answer" }, { status: 502 });
  }

  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, content: answer.trim(), is_ai: true });

  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
