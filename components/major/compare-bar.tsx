"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import majorsJson from "@/seed/majors.json";
import { useCompareStore } from "@/stores/compare-store";
import { useHydrated } from "@/stores/use-hydrated";
import type { Major } from "@/types/major";

const NAME_BY_ID: Record<string, string> = Object.fromEntries(
  (majorsJson as Major[]).map((m) => [m.id, m.name]),
);

export function CompareBar() {
  const hydrated = useHydrated();
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  if (!hydrated || items.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-[64px] z-20 border-t border-border bg-card/95 backdrop-blur shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:bottom-0"
      role="region"
      aria-label="학과 비교 바"
    >
      <div className="container flex items-center gap-2 py-2.5">
        <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
          <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
            비교 ({items.length}/3)
          </span>
          {items.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium"
            >
              {NAME_BY_ID[id] ?? id}
              <button
                type="button"
                onClick={() => remove(id)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`${NAME_BY_ID[id]} 제거`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={clear}
          className="whitespace-nowrap text-xs text-muted-foreground hover:text-foreground"
        >
          전체 비우기
        </button>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          비교하기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
