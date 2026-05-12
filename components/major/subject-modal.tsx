"use client";

import { useEffect, useRef } from "react";
import { Info, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types/major";

type Props = {
  open: boolean;
  onClose: () => void;
  /** 풀 Subject가 있으면 모든 필드를 표시. */
  subject?: Subject | null;
  /** 폴백 — Subject가 없을 때 모달에 보여줄 최소 정보. */
  fallbackName: string;
  fallbackDescription?: string;
  fallbackYear?: number;
};

const DIFFICULTY_LABEL = ["쉬움", "쉬움", "보통", "보통", "어려움", "어려움"];

export function SubjectModal({
  open,
  onClose,
  subject,
  fallbackName,
  fallbackDescription,
  fallbackYear,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open + restore focus to trigger after close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const name = subject?.name ?? fallbackName;
  const year = subject?.year ?? fallbackYear;
  const difficulty = subject?.difficulty;
  const summary = subject?.summary ?? fallbackDescription;
  const description = subject?.description;
  const example = subject?.realWorldExample;
  const prereq = subject?.prerequisiteHS ?? [];
  const isPartial = !subject;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-modal-title"
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card text-card-foreground shadow-lift",
          "sm:max-h-[80vh] sm:rounded-2xl",
          "animate-fade-in",
        )}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b border-border bg-card/95 px-5 py-3 backdrop-blur">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {typeof year === "number" && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {year}학년 대표 과목
                </span>
              )}
              {typeof difficulty === "number" && (
                <Badge variant="soft">
                  난이도 {DIFFICULTY_LABEL[difficulty]} ({difficulty}/5)
                </Badge>
              )}
            </div>
            <h3 id="subject-modal-title" className="mt-1 text-lg font-bold leading-tight">
              {name}
            </h3>
            {summary && (
              <p className="mt-0.5 text-sm text-muted-foreground">{summary}</p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4 text-sm leading-relaxed">
          {description && (
            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                어떤 과목이에요?
              </h4>
              <p className="text-foreground/85">{description}</p>
            </section>
          )}

          {example && (
            <section className="rounded-lg border border-accent/30 bg-accent-soft/60 px-3.5 py-3">
              <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold text-accent">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                일상 속 예시
              </h4>
              <p className="text-foreground/85">{example}</p>
            </section>
          )}

          {prereq.length > 0 && (
            <section>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                관련된 고등학교 과목
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {prereq.map((p) => (
                  <Badge key={p} variant="outline">
                    {p}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {isPartial && !description && (
            <section className="rounded-lg border border-dashed border-border bg-muted/40 px-3.5 py-3 text-xs text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  이 과목의 상세 설명은 준비 중이에요. 학교마다 다룰 수 있어서,
                  관심 있는 학과의 학과 홈페이지를 한번 살펴보면 좋아요.
                </span>
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
