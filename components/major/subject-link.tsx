"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { SubjectModal } from "@/components/major/subject-modal";
import type { Subject } from "@/types/major";

type Props = {
  name: string;
  year?: number;
  subject?: Subject | null;
  fallbackDescription?: string;
};

export function SubjectLink({
  name,
  year,
  subject,
  fallbackDescription,
}: Props) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(subject || fallbackDescription);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${name} 과목 설명 보기`}
        className="group flex w-full items-start justify-between gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold group-hover:text-primary">
              {name}
            </span>
            {hasDetail && (
              <Info
                className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary"
                aria-hidden="true"
              />
            )}
          </div>
          {(subject?.summary || fallbackDescription) && (
            <div className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
              {subject?.summary ?? fallbackDescription}
            </div>
          )}
        </div>
      </button>
      <SubjectModal
        open={open}
        onClose={() => setOpen(false)}
        subject={subject ?? null}
        fallbackName={name}
        fallbackDescription={fallbackDescription}
        fallbackYear={year}
      />
    </>
  );
}
