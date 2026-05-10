"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, GitCompare, X } from "lucide-react";
import majorsJson from "@/seed/majors.json";
import majorExtrasJson from "@/seed/major_extras.json";
import { useCompareStore } from "@/stores/compare-store";
import { useHydrated } from "@/stores/use-hydrated";
import { loadResult } from "@/lib/diagnosis/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { Major, MajorExtras } from "@/types/major";

const MAJOR_BY_ID: Record<string, Major> = Object.fromEntries(
  (majorsJson as Major[]).map((m) => [m.id, m]),
);
const { _note: _n, ...EXTRAS } = majorExtrasJson as Record<
  string,
  MajorExtras | string
>;
void _n;

const OUTLOOK_BADGE: Record<
  MajorExtras["outlook"]["direction"],
  { label: string; className: string }
> = {
  GROWING: { label: "성장", className: "bg-emerald-100 text-emerald-700" },
  STABLE: { label: "유지", className: "bg-sky-100 text-sky-700" },
  DECLINING: { label: "축소", className: "bg-orange-100 text-orange-700" },
  TRANSFORMING: { label: "변화", className: "bg-purple-100 text-purple-700" },
};

type CompareEntry = {
  id: string;
  major: Major;
  extras?: MajorExtras;
  score?: number;
};

function buildEntries(ids: string[], result: DiagnosisResult | null): CompareEntry[] {
  return ids.flatMap<CompareEntry>((id) => {
    const major = MAJOR_BY_ID[id];
    if (!major) return [];
    const extras = (EXTRAS[id] as MajorExtras | undefined) ?? undefined;
    const score = result?.allMajorScores?.[id];
    return [{ id, major, extras, score }];
  });
}

export function CompareView() {
  const hydrated = useHydrated();
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    setResult(loadResult());
  }, []);

  const entries = useMemo(() => buildEntries(items, result), [items, result]);

  if (!hydrated) {
    return <Skeleton className="h-64" />;
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={GitCompare}
        title="아직 담은 학과가 없어요"
        description={`학과 카드의 "비교 담기" 버튼으로 최대 3개까지 모아 비교할 수 있어요.`}
        action={
          <Link href="/majors">
            <Button>
              학과 둘러보기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          담은 학과 <span className="font-semibold text-foreground">{entries.length}</span>개를 비교 중
        </p>
        <button
          onClick={clear}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          전체 비우기
        </button>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${entries.length}, minmax(220px, 1fr))`,
          }}
        >
          {entries.map((e) => (
            <Card key={e.id} className="flex flex-col">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/majors/${e.id}`}
                    className="text-base font-bold leading-tight hover:text-primary"
                  >
                    {e.major.name}
                  </Link>
                  <button
                    onClick={() => remove(e.id)}
                    aria-label="비교에서 제거"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Badge variant="secondary">{e.major.category}</Badge>

                <Section title="적합도">
                  {typeof e.score === "number" ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">{e.score}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  ) : (
                    <NoData>진단 결과가 없어요</NoData>
                  )}
                </Section>

                <Section title="주요 키워드">
                  <div className="flex flex-wrap gap-1">
                    {e.major.keywords.slice(0, 5).map((k) => (
                      <Badge key={k} variant="outline">
                        #{k}
                      </Badge>
                    ))}
                  </div>
                </Section>

                <Section title="대표 직업">
                  {e.extras?.careers?.length ? (
                    <ul className="space-y-1 text-sm">
                      {e.extras.careers.slice(0, 3).map((c) => (
                        <li key={c.name} className="flex justify-between gap-2">
                          <span className="truncate">{c.name}</span>
                          <span className="whitespace-nowrap text-xs font-semibold text-primary">
                            {c.averageSalary.toLocaleString()}만
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NoData>—</NoData>
                  )}
                </Section>

                <Section title="평균 연봉(대표직 평균)">
                  {e.extras?.careers?.length ? (
                    <div className="text-sm font-semibold">
                      약 {Math.round(
                        e.extras.careers.reduce((s, c) => s + c.averageSalary, 0) /
                          e.extras.careers.length,
                      ).toLocaleString()}{" "}
                      만원
                    </div>
                  ) : (
                    <NoData>—</NoData>
                  )}
                </Section>

                <Section title="산업 전망">
                  {e.extras?.outlook ? (
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        OUTLOOK_BADGE[e.extras.outlook.direction].className,
                      )}
                    >
                      {OUTLOOK_BADGE[e.extras.outlook.direction].label}
                    </span>
                  ) : (
                    <NoData>—</NoData>
                  )}
                </Section>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!result?.allMajorScores && (
        <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          진단을 먼저 하면 학과별 적합도가 함께 표시돼요 ·{" "}
          <Link href="/diagnosis" className="text-primary hover:underline">
            진단하러 가기
          </Link>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function NoData({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-muted-foreground">{children}</div>;
}
