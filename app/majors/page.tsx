import Link from "next/link";
import { Building2 } from "lucide-react";
import { getAllMajors, getMajorCategories } from "@/lib/majors";
import { MajorSearch } from "@/components/major/major-search";

export const metadata = {
  title: "학과 탐색 — 진로나침반",
};

export default function MajorsPage() {
  const majors = getAllMajors();
  const categories = getMajorCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">학과 탐색</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총 {majors.length}개 학과 · 관심 있는 학과를 찾아보세요.
          </p>
        </div>
        <Link
          href="/universities"
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary-soft/30"
        >
          <Building2 className="h-4 w-4" aria-hidden="true" /> 대학 탐색
        </Link>
      </div>
      <MajorSearch majors={majors} categories={categories} />
    </div>
  );
}
