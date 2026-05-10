"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LikertQuestion } from "@/components/diagnosis/likert-question";
import { MultiSelectQuestion } from "@/components/diagnosis/multi-select-question";
import { ProgressBar } from "@/components/diagnosis/progress-bar";
import {
  emptyAnswers,
  loadAnswers,
  saveAnswers,
  saveResult,
  clearAnswers,
} from "@/lib/diagnosis/storage";
import { computeResult } from "@/lib/diagnosis/scoring";
import type { DiagnosisAnswers, QuestionsBundle } from "@/types/diagnosis";

type Step =
  | { kind: "likert"; questionId: string; text: string }
  | { kind: "subjects" }
  | { kind: "interests" };

function buildSteps(bundle: QuestionsBundle): Step[] {
  const steps: Step[] = bundle.holland.map((q) => ({
    kind: "likert" as const,
    questionId: q.id,
    text: q.text,
  }));
  steps.push({ kind: "subjects" });
  steps.push({ kind: "interests" });
  return steps;
}

export function DiagnosisRunner({ bundle }: { bundle: QuestionsBundle }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(() => emptyAnswers());
  const [submitting, setSubmitting] = useState(false);

  const steps = useMemo(() => buildSteps(bundle), [bundle]);
  const total = steps.length;

  useEffect(() => {
    const stored = loadAnswers();
    if (stored) setAnswers(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAnswers(answers);
  }, [answers, hydrated]);

  const idx = Math.min(answers.currentIndex, total - 1);
  const step = steps[idx];

  const isAnswered = (() => {
    if (step.kind === "likert") return typeof answers.likert[step.questionId] === "number";
    if (step.kind === "subjects") return answers.subjects.length > 0;
    if (step.kind === "interests") return answers.interests.length > 0;
    return false;
  })();

  const isLast = idx === total - 1;

  function setLikert(qid: string, value: number) {
    setAnswers((prev) => ({ ...prev, likert: { ...prev.likert, [qid]: value } }));
    // Auto-advance after a short delay so the user sees their selection
    setTimeout(() => {
      setAnswers((prev) => {
        if (prev.currentIndex >= total - 1) return prev;
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      });
    }, 180);
  }

  function toggleSubject(s: string) {
    setAnswers((prev) => {
      const has = prev.subjects.includes(s);
      return {
        ...prev,
        subjects: has ? prev.subjects.filter((x) => x !== s) : [...prev.subjects, s],
      };
    });
  }

  function toggleInterest(i: string) {
    setAnswers((prev) => {
      const has = prev.interests.includes(i);
      return {
        ...prev,
        interests: has ? prev.interests.filter((x) => x !== i) : [...prev.interests, i],
      };
    });
  }

  function goBack() {
    setAnswers((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }

  function goNext() {
    setAnswers((prev) => ({
      ...prev,
      currentIndex: Math.min(total - 1, prev.currentIndex + 1),
    }));
  }

  function handleFinish() {
    setSubmitting(true);
    const result = computeResult(answers);
    saveResult(result);
    clearAnswers();
    router.push("/diagnosis/result");
  }

  function handleRestart() {
    if (!confirm("처음부터 다시 진행할까요? 현재 답변이 모두 사라져요.")) return;
    const fresh = emptyAnswers();
    setAnswers(fresh);
  }

  if (!hydrated) {
    return <Skeleton className="h-72" />;
  }

  return (
    <div className="space-y-6">
      <ProgressBar current={idx} total={total} />

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        {step.kind === "likert" && (
          <LikertQuestion
            question={step.text}
            value={answers.likert[step.questionId]}
            onChange={(v) => setLikert(step.questionId, v)}
          />
        )}
        {step.kind === "subjects" && (
          <MultiSelectQuestion
            title="좋아하는 과목을 모두 선택해주세요"
            description="흥미가 있거나 점수가 잘 나오는 과목을 자유롭게 골라주세요."
            options={bundle.subjects}
            selected={answers.subjects}
            onToggle={toggleSubject}
            minSelect={1}
          />
        )}
        {step.kind === "interests" && (
          <MultiSelectQuestion
            title="관심 있는 분야를 골라주세요"
            description="끌리는 산업·주제를 최대 5개까지 선택할 수 있어요."
            options={bundle.interests}
            selected={answers.interests}
            onToggle={toggleInterest}
            minSelect={1}
            maxSelect={5}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={goBack} disabled={idx === 0}>
          <ChevronLeft className="h-4 w-4" /> 이전
        </Button>

        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> 처음부터
        </button>

        {isLast ? (
          <Button
            onClick={handleFinish}
            disabled={!isAnswered || submitting}
            size="md"
          >
            {submitting ? "분석 중…" : "결과 보기"}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!isAnswered} size="sm">
            다음 <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
