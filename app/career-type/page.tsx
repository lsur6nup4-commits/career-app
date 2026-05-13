import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CareerTypeQuiz } from "@/components/career-type/career-type-quiz";

export const metadata = {
  title: "진로 유형 검사 — 진로나침반",
  description:
    "20문항으로 알아보는 나만의 진로 유형 코드. 4축 16가지 진로 유형 중 나는 어떤 타입?",
};

export default function CareerTypePage() {
  return (
    <div className="mx-auto max-w-md">
      <Suspense fallback={<Skeleton className="h-96" />}>
        <CareerTypeQuiz />
      </Suspense>
    </div>
  );
}
