"use client";

type Props = { current: number; total: number };

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{current + 1}</span> /{" "}
          {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
