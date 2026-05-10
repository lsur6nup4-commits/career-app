"use client";

import { Star } from "lucide-react";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useHydrated } from "@/stores/use-hydrated";
import { cn } from "@/lib/utils";

type Props = {
  majorId: string;
  size?: "sm" | "md";
  className?: string;
};

export function BookmarkButton({ majorId, size = "sm", className }: Props) {
  const hydrated = useHydrated();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const toggle = useBookmarkStore((s) => s.toggle);

  const active = hydrated && bookmarks.includes(majorId);
  const sizes = size === "md" ? "px-3 py-2 text-sm" : "px-2.5 py-1.5 text-xs";

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(majorId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-medium transition-colors",
        sizes,
        active
          ? "border-amber-400 bg-amber-50 text-amber-700"
          : "border-border bg-white text-foreground hover:border-amber-400 hover:text-amber-700",
        className,
      )}
      aria-pressed={active}
    >
      <Star
        className={cn("h-3.5 w-3.5", active && "fill-amber-400 text-amber-400")}
      />
      {active ? "북마크 됨" : "북마크"}
    </button>
  );
}
