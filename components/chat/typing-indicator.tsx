"use client";

import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
