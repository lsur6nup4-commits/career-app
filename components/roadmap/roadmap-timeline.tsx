import { Briefcase, GraduationCap, School, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { RoadmapStage } from "@/lib/roadmap";

const PHASE_STYLE: Record<
  RoadmapStage["phase"],
  { dot: string; ring: string; label: string; icon: ComponentType<{ className?: string }> }
> = {
  HIGH_SCHOOL: {
    dot: "bg-sky-500",
    ring: "ring-sky-100",
    label: "고등학교",
    icon: School,
  },
  ADMISSION: {
    dot: "bg-amber-500",
    ring: "ring-amber-100",
    label: "입시",
    icon: Sparkles,
  },
  UNIVERSITY: {
    dot: "bg-primary",
    ring: "ring-primary/15",
    label: "대학",
    icon: GraduationCap,
  },
  CAREER: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-100",
    label: "진로",
    icon: Briefcase,
  },
};

export function RoadmapTimeline({ stages }: { stages: RoadmapStage[] }) {
  return (
    <div className="relative">
      {/* vertical guide line */}
      <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />

      <ol className="space-y-5">
        {stages.map((s) => {
          const style = PHASE_STYLE[s.phase];
          const Icon = style.icon;
          return (
            <li key={s.key} className="relative pl-12">
              <span
                className={cn(
                  "absolute left-0 top-2 flex h-9 w-9 items-center justify-center rounded-full text-white ring-4",
                  style.dot,
                  style.ring,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {s.stage}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {style.label}
                  </span>
                </div>
                <h3 className="text-base font-semibold leading-tight">
                  {s.title}
                </h3>

                <ul className="mt-3 space-y-1.5">
                  {s.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm text-foreground/85"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <div className="min-w-0">
                        <div className="font-medium">{item.label}</div>
                        {item.detail && (
                          <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {item.detail}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
