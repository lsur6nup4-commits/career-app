"use client";

import { Check, GitCompare } from "lucide-react";
import { useState } from "react";
import { COMPARE_MAX, useCompareStore } from "@/stores/compare-store";
import { useHydrated } from "@/stores/use-hydrated";
import { cn } from "@/lib/utils";

type Props = {
  majorId: string;
  size?: "sm" | "md";
  className?: string;
};

export function CompareButton({ majorId, size = "sm", className }: Props) {
  const hydrated = useHydrated();
  const items = useCompareStore((s) => s.items);
  const toggle = useCompareStore((s) => s.toggle);
  const [warn, setWarn] = useState(false);

  const active = hydrated && items.includes(majorId);
  const sizes = size === "md" ? "px-3 py-2 text-sm" : "px-2.5 py-1.5 text-xs";

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ok = toggle(majorId);
    if (!ok) {
      setWarn(true);
      setTimeout(() => setWarn(false), 1600);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-medium transition-colors",
        sizes,
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-white text-foreground hover:border-primary hover:text-primary",
        className,
      )}
      aria-pressed={active}
    >
      {active ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
      {warn ? `최대 ${COMPARE_MAX}개` : active ? "비교 담김" : "비교 담기"}
    </button>
  );
}
