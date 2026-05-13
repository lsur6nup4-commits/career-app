import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { AllTypesClient } from "@/components/career-type/all-types-client";

export const metadata = {
  title: "16가지 진로 유형 — 진로나침반",
  description:
    "4축 16가지 진로 유형을 모두 살펴보세요. 각 유형별 특징, 강점, 추천 학과·직업을 확인할 수 있어요.",
};

export default function CareerTypeAllPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-2">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/career-type"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">16가지 진로 유형</h1>
          <p className="text-xs text-muted-foreground">
            탭하면 상세 정보를 볼 수 있어요
          </p>
        </div>
      </div>

      {/* 검사 CTA */}
      <Link
        href="/career-type"
        className="flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground shadow-glow transition-all hover:brightness-110"
      >
        <div>
          <p className="text-sm font-bold">내 유형은 무엇일까요?</p>
          <p className="text-xs text-primary-foreground/80">
            20문항 · 약 3분
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          검사 시작
        </span>
      </Link>

      {/* 클라이언트: 그리드 + 상세 패널 */}
      <AllTypesClient />
    </div>
  );
}
