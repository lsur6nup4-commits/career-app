"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { HollandRadar } from "@/components/diagnosis/holland-radar";
import { HOLLAND_DESCRIPTIONS, HOLLAND_LABELS } from "@/lib/diagnosis/mappings";
import { loadResult, clearResult } from "@/lib/diagnosis/storage";
import type { DiagnosisResult } from "@/types/diagnosis";

export function ResultView() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null | "loading">(
    "loading",
  );

  useEffect(() => {
    setResult(loadResult());
  }, []);

  if (result === "loading") {
    return <Skeleton className="h-64" />;
  }

  if (!result) {
    return (
      <EmptyState
        icon={Sparkles}
        title="아직 진단 결과가 없어요"
        description="진단을 먼저 완료해주세요."
        action={
          <Link href="/diagnosis">
            <Button>
              진단 시작하기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />
    );
  }

  function handleRestart() {
    if (!confirm("진단을 다시 진행하시겠어요?")) return;
    clearResult();
    router.push("/diagnosis");
  }

  const [t1, t2] = result.topHollandTypes;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">진단 결과</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          나의 성향과 추천 학과
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>나의 Holland 유형</CardTitle>
          <p className="text-sm text-muted-foreground">
            가장 강한 두 유형:{" "}
            <span className="font-semibold text-foreground">
              {HOLLAND_LABELS[t1]}({t1}) · {HOLLAND_LABELS[t2]}({t2})
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <HollandRadar scores={result.hollandScores} />
          <div className="mt-2 space-y-2 text-sm">
            <div className="rounded-md bg-muted/50 p-3">
              <span className="font-semibold text-primary">
                {HOLLAND_LABELS[t1]}형
              </span>{" "}
              · {HOLLAND_DESCRIPTIONS[t1]}
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <span className="font-semibold text-primary">
                {HOLLAND_LABELS[t2]}형
              </span>{" "}
              · {HOLLAND_DESCRIPTIONS[t2]}
            </div>
          </div>
        </CardContent>
      </Card>

      {(result.selectedSubjects.length > 0 || result.selectedInterests.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>내 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {result.selectedSubjects.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs text-muted-foreground">
                  좋아하는 과목
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.selectedSubjects.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {result.selectedInterests.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs text-muted-foreground">관심 분야</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.selectedInterests.map((i) => (
                    <Badge key={i} variant="outline">
                      #{i}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">추천 학과 Top {result.topMajors.length}</h2>
          <p className="text-xs text-muted-foreground">
            적합도는 진단 답변과 매핑 데이터로 산출된 참고용 점수예요.
          </p>
        </div>

        <div className="space-y-2.5">
          {result.topMajors.map((m, idx) => (
            <Link key={m.majorId} href={`/majors/${m.majorId}`} className="group block">
              <Card className="transition-shadow group-hover:shadow-md">
                <div className="flex items-stretch">
                  <div className="flex w-14 flex-shrink-0 items-center justify-center rounded-l-lg bg-primary/5 text-primary">
                    <span className="text-lg font-bold">#{idx + 1}</span>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold group-hover:text-primary">
                          {m.name}
                        </span>
                        <Badge variant="secondary">{m.category}</Badge>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {m.summary}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-foreground/70">
                        {m.reason}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-primary">
                        {m.score}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        적합도
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4" /> 다시 진단하기
        </Button>
        <Link
          href="/majors"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          전체 학과 둘러보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
