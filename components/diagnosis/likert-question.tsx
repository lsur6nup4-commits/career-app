"use client";

import { cn } from "@/lib/utils";

const LABELS = ["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"];

type Props = {
  question: string;
  value?: number;
  onChange: (value: number) => void;
};

export function LikertQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{question}</h2>
      <div className="flex flex-col gap-2">
        {LABELS.map((label, idx) => {
          const v = idx + 1;
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all",
                active
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border bg-white hover:bg-muted",
              )}
            >
              <span>{label}</span>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2",
                  active ? "border-primary bg-primary" : "border-border",
                )}
              >
                {active && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
