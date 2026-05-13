"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import {
  computeResult,
  getQuestions,
  saveCareerTypeResult,
} from "@/lib/career-types";
import { ResultScreen } from "./result-screen";
import type { QuizResult } from "@/types/career-type";
import { AXIS_PAIRS } from "@/types/career-type";
import { cn } from "@/lib/utils";

const QUESTIONS = getQuestions();
const TOTAL = QUESTIONS.length;

// ── 인트로 ────────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[calc(100svh-10rem)] flex-col items-center justify-center py-8 animate-fade-in">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* 아이콘 */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-4xl shadow-glow">
          🧭
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            진로 유형 검사
          </h1>
          <p className="mt-2 text-muted-foreground">
            나는 어떤 진로 유형일까?
            <br />
            20문항으로 알아보는 나만의 진로 코드
          </p>
        </div>

        {/* 4축 소개 */}
        <div className="grid grid-cols-2 gap-2 text-left">
          {AXIS_PAIRS.map((pair) => (
            <div
              key={pair.a}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-primary-soft px-1.5 py-0.5 text-xs font-bold text-primary">
                  {pair.a}
                </span>
                <span className="text-xs text-muted-foreground">vs</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold text-muted-foreground">
                  {pair.b}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium">
                {pair.nameA} vs {pair.nameB}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>총 20문항 · 약 3분 소요</p>
          <p>정답이 없어요 — 솔직하게 답하세요 😊</p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-95"
        >
          <Sparkles className="mr-1.5 inline h-4 w-4" />
          검사 시작하기
        </button>
      </div>
    </div>
  );
}

// ── 진행률 바 ─────────────────────────────────────────────────────────────
function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── 문항 카드 ─────────────────────────────────────────────────────────────
function QuestionCard({
  questionIndex,
  isExiting,
  onAnswer,
}: {
  questionIndex: number;
  isExiting: boolean;
  onAnswer: (value: string) => void;
}) {
  const q = QUESTIONS[questionIndex];
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(value: string) {
    if (selected) return; // 중복 클릭 방지
    setSelected(value);
    onAnswer(value);
  }

  return (
    <div
      className={cn(
        "space-y-5 transition-all duration-200",
        isExiting
          ? "animate-slide-out-left pointer-events-none"
          : "animate-slide-in-right",
      )}
    >
      {/* 질문 텍스트 */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Q{questionIndex + 1}
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          {q.text}
        </p>
      </div>

      {/* 선택지 */}
      <div className="space-y-3">
        {q.options.map((opt) => {
          const isSelected = selected === opt.value;
          const isOther = selected !== null && !isSelected;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "w-full rounded-2xl border-2 p-4 text-left text-sm font-medium leading-relaxed transition-all duration-150 active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : isOther
                    ? "border-border bg-card opacity-40"
                    : "border-border bg-card hover:border-primary/50 hover:bg-primary-soft/30 hover:shadow-card",
              )}
              disabled={!!selected}
            >
              <span className="mr-2 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold opacity-60">
                {opt.value}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// BasicResultScreen은 result-screen.tsx의 ResultScreen으로 대체됨

// ── 메인 오케스트레이터 ───────────────────────────────────────────────────
export type QuizPhase = "intro" | "quiz" | "result";

export function CareerTypeQuiz({
  initialPhase = "intro",
  initialResult = null,
}: {
  initialPhase?: QuizPhase;
  initialResult?: QuizResult | null;
}) {
  const [phase, setPhase] = useState<QuizPhase>(initialPhase);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(initialResult);
  const [isExiting, setIsExiting] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setQIndex(0);
    setAnswers({});
    setIsExiting(false);
    setQuestionKey(0);
  }, []);

  const handleAnswer = useCallback(
    (value: string) => {
      const q = QUESTIONS[qIndex];
      const newAnswers = { ...answers, [q.id]: value };
      setAnswers(newAnswers);
      setIsExiting(true);

      setTimeout(() => {
        const nextIndex = qIndex + 1;
        if (nextIndex >= TOTAL) {
          // 계산 후 결과 화면
          const computed = computeResult(newAnswers, QUESTIONS);
          saveCareerTypeResult(computed);
          setResult(computed);
          setIsExiting(false);
          setPhase("result");
        } else {
          setQIndex(nextIndex);
          setQuestionKey((k) => k + 1);
          setIsExiting(false);
        }
      }, 210);
    },
    [qIndex, answers],
  );

  const handleBack = useCallback(() => {
    if (qIndex === 0) {
      setPhase("intro");
      return;
    }
    setQIndex((i) => i - 1);
    setQuestionKey((k) => k + 1);
    // 이전 답변 제거
    const q = QUESTIONS[qIndex];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });
  }, [qIndex]);

  const handleRetry = useCallback(() => {
    setPhase("intro");
    setQIndex(0);
    setAnswers({});
    setResult(null);
    setIsExiting(false);
    setQuestionKey(0);
  }, []);

  // ── 인트로 ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return <IntroScreen onStart={handleStart} />;
  }

  // ── 결과 ────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    return <ResultScreen result={result} onRetry={handleRetry} />;
  }

  // ── 퀴즈 ────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      {/* 상단: 뒤로가기 + 진행률 */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {qIndex === 0 ? "처음으로" : "이전 문항"}
        </button>
        <ProgressBar current={qIndex + 1} total={TOTAL} />
      </div>

      {/* 문항 (key로 재마운트 → enter 애니메이션 자동) */}
      <QuestionCard
        key={questionKey}
        questionIndex={qIndex}
        isExiting={isExiting}
        onAnswer={handleAnswer}
      />

      {/* 하단 힌트 */}
      <p className="text-center text-xs text-muted-foreground">
        직관적으로 떠오르는 답을 선택하세요
      </p>
    </div>
  );
}
