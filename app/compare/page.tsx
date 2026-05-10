import { CompareView } from "@/components/major/compare-view";

export const metadata = {
  title: "학과 비교 — 진로나침반",
};

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">학과 비교</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          담은 학과를 한눈에 비교해보세요.
        </p>
      </div>
      <CompareView />
    </div>
  );
}
