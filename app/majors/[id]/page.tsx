import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Map, Briefcase } from "lucide-react";
import { getAllMajors, getFullMajorById } from "@/lib/majors";
import { getJobsForMajor } from "@/lib/jobs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MajorTabs } from "@/components/major/major-tabs";
import { CompareButton } from "@/components/major/compare-button";
import { BookmarkButton } from "@/components/major/bookmark-button";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllMajors().map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const major = getFullMajorById(id);
  if (!major) return { title: "학과를 찾을 수 없습니다" };
  return { title: `${major.name} — 진로나침반` };
}

export default async function MajorDetailPage({ params }: Props) {
  const { id } = await params;
  const major = getFullMajorById(id);
  if (!major) notFound();

  const relatedJobs = getJobsForMajor(id);

  return (
    <div className="space-y-6">
      <Link
        href="/majors"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 학과 목록으로
      </Link>

      <header className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{major.category}</Badge>
          {major.hollandTags.map((tag) => (
            <Badge key={tag} variant="outline">
              Holland · {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {major.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{major.summary}</p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          {major.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {major.keywords.map((k) => (
            <Badge key={k} variant="outline">
              #{k}
            </Badge>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <BookmarkButton majorId={major.id} size="md" />
          <CompareButton majorId={major.id} size="md" />
          <Link
            href={`/roadmap/${major.id}`}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            <Map className="h-3.5 w-3.5" /> 로드맵 보기
          </Link>
        </div>
      </header>

      <MajorTabs major={major} />

      {/* ── 커리어넷 관련 직업 ─────────────────────────────────────── */}
      {relatedJobs.length > 0 && (
        <section aria-labelledby="jobs-heading">
          <h2
            id="jobs-heading"
            className="mb-3 flex items-center gap-2 text-lg font-semibold"
          >
            <Briefcase className="h-5 w-5 text-primary" />
            관련 직업 ({relatedJobs.length})
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {relatedJobs.slice(0, 12).map((job) => (
              <li key={job.job_cd}>
                <Link
                  href={`/jobs/${job.job_cd}`}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-[13px] font-semibold leading-snug group-hover:text-primary">
                    {job.job_nm}
                  </p>
                  {job.wage && (
                    <p className="text-[11px] text-muted-foreground">
                      {job.wage}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          {relatedJobs.length > 12 && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              +{relatedJobs.length - 12}개 더 있어요 ·{" "}
              <Link
                href="/jobs"
                className="text-primary underline underline-offset-2"
              >
                직업 탐색
              </Link>
              에서 확인하세요
            </p>
          )}
        </section>
      )}

      {/* ── AI 콘텐츠 고지 ─────────────────────────────────────────────── */}
      <p className="rounded-lg bg-muted/60 px-4 py-3 text-center text-[11px] leading-relaxed text-muted-foreground">
        학과 설명·과목 정보는 AI가 생성한 참고용 콘텐츠입니다.
        실제 정보는 각 대학 홈페이지를 확인하세요.
      </p>
    </div>
  );
}
