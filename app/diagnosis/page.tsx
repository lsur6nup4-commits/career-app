import Link from "next/link";
import { ArrowRight, Clock, ListChecks, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { totalSteps } from "@/lib/diagnosis/scoring";

export const metadata = {
  title: "진로 진단 시작 — 진로나침반",
};

export default function DiagnosisIntroPage() {
  const steps = totalSteps();
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-accent p-7 text-white shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5" /> 진로 진단
        </div>
        <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
          나에게 맞는 학과를
          <br />
          5분 만에 찾아보세요
        </h1>
        <p className="mt-2 text-sm text-white/85">
          Holland 직업흥미검사 + 관심 분야를 기반으로
          <br />
          적합도 높은 학과 Top 10을 추천해드려요.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <Clock className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">약 5분</CardTitle>
            <p className="text-xs text-muted-foreground">소요 시간</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <ListChecks className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">{steps}문항</CardTitle>
            <p className="text-xs text-muted-foreground">5점 척도 + 다중 선택</p>
          </CardHeader>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader>
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">Top 10</CardTitle>
            <p className="text-xs text-muted-foreground">학과 추천</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">진단 안내</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/80">
          <p>· 정답이 없는 검사예요. 솔직하게 답할수록 결과가 정확해져요.</p>
          <p>· 진행 도중 나가도 답변이 자동 저장돼요(이 기기에 저장).</p>
          <p>· 결과는 참고용 추천이며, 진로는 다양한 측면을 함께 고려해야 해요.</p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <Link
          href="/diagnosis/run"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground hover:opacity-90"
        >
          진단 시작하기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
