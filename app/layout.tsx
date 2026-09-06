import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 식단 서비스 Q&A",
  description: "개인화된 식단 서비스에 대해 익명으로 묻고 답하는 게시판",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
