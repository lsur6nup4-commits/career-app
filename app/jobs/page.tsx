import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getAllJobs, getJobCategories } from "@/lib/jobs";
import { getAllAiRisk } from "@/lib/ai-risk";
import { JobSearch } from "@/components/jobs/job-search";

export const metadata = {
  title: "직업 탐색 — 진로나침반",
};

export default function JobsPage() {
  const jobs = getAllJobs();
  const categories = getJobCategories();
  const riskData = Object.fromEntries(
    getAllAiRisk().map((r) => [r.job_cd, { risk_2024: r.risk_2024, rate_2024: r.rate_2024 }]),
  );

  const mappedCount = jobs.filter((j) => j.relatedMajors.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">직업 탐색</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총 {jobs.length}개 직업 · {mappedCount}개 직업에 관련 학과 연결됨
          </p>
        </div>
        <Link
          href="/majors"
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary-soft/30"
        >
          <GraduationCap className="h-4 w-4" aria-hidden="true" /> 학과 탐색
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-primary-soft/20 px-4 py-3 text-sm text-foreground/70">
        💡 직업을 클릭하면 관련 학과를 바로 확인할 수 있어요.{" "}
        <strong className="text-foreground">커리어넷</strong> 직업정보 + 대입정보포털 CSV 데이터 교차 분석
      </div>

      <JobSearch jobs={jobs} categories={categories} riskData={riskData} />
    </div>
  );
}
