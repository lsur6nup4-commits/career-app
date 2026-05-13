import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Heart,
  TrendingUp,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { getAllJobs, getJobById, getRelatedMajors } from "@/lib/jobs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllJobs().map((j) => ({ id: String(j.job_cd) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return { title: "직업을 찾을 수 없어요" };
  return { title: `${job.job_nm} — 진로나침반` };
}

// ── 배지 헬퍼 ─────────────────────────────────────────────────────────────
function wageCls(wage: string) {
  if (wage === "5천만원↑")
    return "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700";
  if (wage === "4천만원↑")
    return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700";
  if (wage === "3천만원↑")
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700";
  return "bg-muted text-muted-foreground border-border";
}

function ratingCls(val: string) {
  if (val === "매우좋음")
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700";
  if (val === "좋음")
    return "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700";
  if (val === "보통미만")
    return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700";
  return "bg-muted text-muted-foreground border-border";
}

// ── 페이지 ────────────────────────────────────────────────────────────────
export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();

  const relMajors = getRelatedMajors(job);
  const relJobNames = job.rel_job_nm
    ? job.rel_job_nm
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 직업 목록으로
      </Link>

      {/* ── 헤더 ─────────────────────────────────────────────────────── */}
      <header className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{job.top_nm}</Badge>
          <Badge variant="outline">{job.aptit_name}</Badge>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {job.job_nm}
        </h1>

        {/* ── 지표 배지 ────────────────────────────────────────────── */}
        <div className="mt-3 flex flex-wrap gap-2">
          {job.wage && (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                wageCls(job.wage),
              )}
            >
              💰 평균연봉 {job.wage}
            </span>
          )}
          {job.wlb && (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                ratingCls(job.wlb),
              )}
            >
              ⚖️ 워라밸 {job.wlb}
            </span>
          )}
          {job.social && (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                ratingCls(job.social),
              )}
            >
              👥 사회인식 {job.social}
            </span>
          )}
        </div>

        {/* ── 조회/좋아요 ──────────────────────────────────────────── */}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            조회 {job.views.toLocaleString("ko-KR")}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            관심 {job.likes.toLocaleString("ko-KR")}
          </span>
          <a
            href={`https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=${job.job_cd}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
          >
            커리어넷 상세보기
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      {/* ── 직업 설명 ─────────────────────────────────────────────────── */}
      {job.work && (
        <section aria-labelledby="work-heading">
          <h2 id="work-heading" className="mb-3 text-lg font-semibold">
            하는 일
          </h2>
          <Card className="p-5">
            <p className="text-sm leading-relaxed text-foreground/85">
              {job.work}
            </p>
          </Card>
        </section>
      )}

      {/* ── 관련 직업명 ───────────────────────────────────────────────── */}
      {relJobNames.length > 0 && (
        <section aria-labelledby="rel-job-heading">
          <h2 id="rel-job-heading" className="mb-3 text-lg font-semibold">
            관련 직업명
          </h2>
          <div className="flex flex-wrap gap-2">
            {relJobNames.map((name) => (
              <Badge key={name} variant="outline">
                {name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* ── 관련 학과 ─────────────────────────────────────────────────── */}
      <section aria-labelledby="majors-heading">
        <h2 id="majors-heading" className="mb-3 text-lg font-semibold">
          <span className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            관련 학과 ({relMajors.length})
          </span>
        </h2>

        {relMajors.length === 0 ? (
          <EmptyState
            title="연결된 학과가 없어요"
            description="CSV 데이터 기반 매핑에 해당 직업이 포함되지 않았습니다."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relMajors.map((major) => (
              <li key={major.id}>
                <Link
                  href={`/majors/${major.id}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-card">
                    <div className="p-3.5">
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold group-hover:text-primary">
                            {major.name}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {major.summary}
                          </p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0 text-[10px]">
                          {major.category}
                        </Badge>
                      </div>
                      {major.averageAdmissionQuota && (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          평균 입학정원{" "}
                          <strong className="text-foreground">
                            {major.averageAdmissionQuota}명
                          </strong>
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── 출처 ────────────────────────────────────────────────────────── */}
      <p className="text-center text-xs text-muted-foreground">
        직업정보 출처:{" "}
        <a
          href="https://www.career.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          커리어넷
        </a>{" "}
        · 학과 매핑:{" "}
        <a
          href="https://www.adiga.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          대입정보포털 CSV
        </a>
      </p>
    </div>
  );
}
