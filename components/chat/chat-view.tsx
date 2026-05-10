"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleX, Send, Trash2 } from "lucide-react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { QuickQuestions } from "@/components/chat/quick-questions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { clearHistory, loadHistory, saveHistory } from "@/lib/chat/storage";
import { loadResult } from "@/lib/diagnosis/storage";
import type { ChatMessage, DiagnosisContext, SseEvent } from "@/types/chat";
import type { DiagnosisResult } from "@/types/diagnosis";

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toContext(result: DiagnosisResult | null): DiagnosisContext | undefined {
  if (!result) return undefined;
  return {
    hollandScores: result.hollandScores,
    topHollandTypes: result.topHollandTypes,
    selectedSubjects: result.selectedSubjects,
    selectedInterests: result.selectedInterests,
    topMajors: result.topMajors.map((m) => ({
      name: m.name,
      score: m.score,
      category: m.category,
    })),
  };
}

export function ChatView() {
  const searchParams = useSearchParams();
  const presetQuery = searchParams.get("q") ?? "";

  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMessages(loadHistory());
    setDiagnosis(loadResult());
    setHydrated(true);
  }, []);

  // Prefill input from ?q= so home "popular questions" can deep-link.
  useEffect(() => {
    if (!hydrated || !presetQuery) return;
    setInput(presetQuery);
    inputRef.current?.focus();
  }, [hydrated, presetQuery]);

  useEffect(() => {
    if (hydrated) saveHistory(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const userMsg: ChatMessage = { id: genId(), role: "user", content: trimmed };
    const assistantId = genId();
    const placeholder: ChatMessage = { id: assistantId, role: "assistant", content: "" };

    const nextMessages = [...messages, userMsg, placeholder];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({
            role,
            content,
          })),
          diagnosisContext: toContext(diagnosis),
        }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("응답 본문이 없어요.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          const line = raw.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          let payload: SseEvent;
          try {
            payload = JSON.parse(line.slice(6)) as SseEvent;
          } catch {
            continue;
          }

          if (payload.type === "delta") {
            const chunk = payload.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + chunk } : m,
              ),
            );
          } else if (payload.type === "error") {
            setError(payload.message);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "요청 중 오류가 발생했어요.");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      // Remove empty assistant placeholder if nothing arrived
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  }

  function handleClear() {
    if (!confirm("대화 내역을 모두 지울까요?")) return;
    setMessages([]);
    clearHistory();
    setError(null);
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  if (!hydrated) {
    return <Skeleton className="h-72" />;
  }

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 14rem)" }}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI 진로 상담사</h1>
          <p className="text-xs text-muted-foreground">
            {diagnosis ? (
              <>
                진단 결과를 알고 있어요 ·{" "}
                <Link href="/diagnosis/result" className="text-primary hover:underline">
                  결과 보기
                </Link>
              </>
            ) : (
              <>
                진단을 먼저 하면 더 정확해요 ·{" "}
                <Link href="/diagnosis" className="text-primary hover:underline">
                  진단하러 가기
                </Link>
              </>
            )}
          </p>
        </div>
        {!empty && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> 대화 지우기
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-muted/40 p-4"
      >
        {empty ? (
          <QuickQuestions onPick={send} hasDiagnosis={!!diagnosis} />
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {streaming && messages[messages.length - 1]?.content === "" && (
              <TypingIndicator />
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <CircleX className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-end gap-2 rounded-xl border border-border bg-white p-2 shadow-sm"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="진로에 대해 무엇이든 물어보세요..."
          className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none"
          disabled={streaming}
        />
        {streaming ? (
          <Button type="button" variant="outline" size="sm" onClick={handleStop}>
            중지
          </Button>
        ) : (
          <Button type="submit" size="sm" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
            보내기
          </Button>
        )}
      </form>
    </div>
  );
}
