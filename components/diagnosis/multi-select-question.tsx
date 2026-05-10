"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  minSelect?: number;
  maxSelect?: number;
};

export function MultiSelectQuestion({
  title,
  description,
  options,
  selected,
  onToggle,
  minSelect = 1,
  maxSelect,
}: Props) {
  const atMax = maxSelect ? selected.length >= maxSelect : false;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          최소 {minSelect}개{maxSelect && ` · 최대 ${maxSelect}개`} 선택 ·
          현재 <span className="font-semibold text-foreground">{selected.length}</span>개
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          const disabled = !active && atMax;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(opt)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white hover:bg-muted",
                disabled && "opacity-40",
              )}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
