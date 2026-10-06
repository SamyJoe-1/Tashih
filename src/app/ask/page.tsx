import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { Chat } from "./Chat";

export const metadata: Metadata = pageMeta("/ask", "اسأل تصحيح", "اسأل عن صحة أي حديث بلغتك الطبيعية، واحصل على حكمه ومصدره.");

export default function AskPage() {
  return (
    <div className="pattern-light min-h-dvh bg-gradient-to-b from-white to-paper pt-24">
      <Chat />
    </div>
  );
}
