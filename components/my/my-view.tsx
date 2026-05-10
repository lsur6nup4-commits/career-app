"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookmarkCheck, Sparkles, StickyNote, Trash2 } from "lucide-react";
import majorsJson from "@/seed/majors.json";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useHydrated } from "@/stores/use-hydrated";
import { loadResult } from "@/lib/diagnosis/storage";
import { HOLLAND_LABELS } from "@/lib/diagnosis/mappings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Major } from "@/types/major";
import type { DiagnosisResult, HollandType } from "@/types/diagnosis";

const MAJOR_BY_ID: Record<string, Major> = Object.fromEntries(
  (majorsJson as Major[]).map((m) => [m.id, m]),
);

export function MyView() {
  const hydrated = useHydrated();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const notes = useBookmarkStore((s) => s.notes);
  const setNote = useBookmarkStore((s) => s.setNote);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    setResult(loadResult());
  }, []);

  const items = useMemo(
    () => bookmarks.map((id) => MAJOR_BY_ID[id]).filter((m): m is Major => !!m),
    [bookmarks],
  );

  if (!hydrated) {
    return <Skeleton className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <DiagnosisSummary result={result} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            북마크한 학과 ({items.length})
          </h2>
          {items.length > 0 && (
            <Link
              href="/majors"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              + 더 추가하기
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="아직 북마크한 학과가 없어요"
            description="관심 있는 학과 상세에서 ★ 북마크를 눌러 모아보세요."
            action={
              <Link href="/majors">
                <Button>
                  학과 둘러보기 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {items.map((m) => {
              const score = result?.allMajorScores?.[m.id];
              return (
                <Card key={m.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/majors/${m.id}`}
                            className="text-base font-semibold hover:text-primary"
                          >
                            {m.name}
                          </Link>
                          <Badge variant="secondary">{m.category}</Badge>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          {m.summary}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {typeof score === "number" && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                            적합도 {score}
                          </span>
                        )}
                        <button
                          onClick={() => removeBookmark(m.id)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="inline h-3.5 w-3.5" /> 해제
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <StickyNote className="h-3.5 w-3.5" /> 진로 노트
                    </label>
                    <textarea
                      value={notes[m.id] ?? ""}
                      onChange={(e) => setNote(m.id, e.target.value)}
                      placeholder="이 학과에 대한 생각, 알아본 정보, 결심 등을 자유롭게 적어보세요."
                      rows={3}
                      className="w-full resize-y rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <Link
                        href={`/roadmap/${m.id}`}
                        className="text-primary hover:underline"
                      >
                        로드맵 보기 →
                      </Link>
                      <span>{(notes[m.id] ?? "").length}자</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function DiagnosisSummary({ result }: { result: DiagnosisResult | null }) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">진단 결과</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          아직 진단을 완료하지 않았어요.{" "}
          <Link href="/diagnosis" className="text-primary hover:underline">
            진단하러 가기 →
          </Link>
        </CardContent>
      </Card>
    );
  }

  const [t1, t2] = result.topHollandTypes;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">내 진단 결과</CardTitle>
          </div>
          <Link
            href="/diagnosis/result"
            className="text-xs text-primary hover:underline"
          >
            전체 결과 보기 →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Holland 강세 유형: </span>
          <span className="font-semibold">
            {HOLLAND_LABELS[t1 as HollandType]}({t1}) ·{" "}
            {HOLLAND_LABELS[t2 as HollandType]}({t2})
          </span>
        </div>
        <div className="text-muted-foreground">
          추천 Top 3:{" "}
          <span className="text-foreground">
            {result.topMajors
              .slice(0, 3)
              .map((m) => `${m.name}(${m.score})`)
              .join(", ")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
