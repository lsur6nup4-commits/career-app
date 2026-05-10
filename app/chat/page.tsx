import { Suspense } from "react";
import { ChatView } from "@/components/chat/chat-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "AI 진로 상담 — 진로나침반",
};

export default function ChatPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72" />}>
      <ChatView />
    </Suspense>
  );
}
