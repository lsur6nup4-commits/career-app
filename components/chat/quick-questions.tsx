"use client";

import { Sparkles } from "lucide-react";

const QUESTIONS = [
  "내 적성에 맞는 직업은 어떤 게 있을까요?",
  "추천된 학과 중 어디부터 알아보면 좋을까요?",
  "수시와 정시, 저는 어느 쪽이 유리할까요?",
  "고2 때부터 어떤 활동을 하면 좋을까요?",
  "관심 학과가 두 개일 때 어떻게 결정하나요?",
  "자기소개서는 언제부터 준비하면 되나요?",
];

export function QuickQuestions({
  onPick,
  hasDiagnosis,
}: {
  onPick: (q: string) => void;
  hasDiagnosis: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-accent" />
          어떤 고민을 나눠볼까요?
        </div>
        <p className="text-xs text-muted-foreground">
          {hasDiagnosis
            ? "진단 결과를 알고 있는 AI 상담사가 답변해드려요."
            : "진단을 먼저 마치면 더 정확한 상담이 가능해요."}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="rounded-lg border border-border bg-white px-3 py-2.5 text-left text-sm text-foreground/85 transition-colors hover:border-primary hover:bg-primary/5"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
