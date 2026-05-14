"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Map,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectLink } from "@/components/major/subject-link";
import { cn } from "@/lib/utils";
import type { FullMajor, IndustryOutlook } from "@/types/major";
import type { Job } from "@/types/job";
import { getAiRisk, RISK_META } from "@/lib/ai-risk";
import type { RiskLevel } from "@/lib/ai-risk";

type TabKey = "curriculum" | "careers" | "industry" | "activities" | "universities";

const TABS: { key: TabKey; label: string }[] = [
  { key: "curriculum", label: "커리큘럼" },
  { key: "careers", label: "졸업 후 진로" },
  { key: "industry", label: "산업 현황" },
  { key: "activities", label: "추천 활동" },
  { key: "universities", label: "개설 대학" },
];

export function MajorTabs({ major, relatedJobs = [] }: { major: FullMajor; relatedJobs?: Job[] }) {
  const [tab, setTab] = useState<TabKey>("curriculum");

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg border border-border bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "curriculum" && <CurriculumTab major={major} />}
      {tab === "careers" && <CareersTab major={major} relatedJobs={relatedJobs} />}
      {tab === "industry" && <IndustryTab major={major} relatedJobs={relatedJobs} />}
      {tab === "activities" && <ActivitiesTab major={major} />}
      {tab === "universities" && <UniversitiesTab major={major} />}
    </div>
  );
}

function CurriculumTab({ major }: { major: FullMajor }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          <CardTitle>학년별 대표 과목</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          학교마다 차이가 있어요. 과목을 누르면 자세한 설명을 볼 수 있습니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {major.curriculum.map((year) => (
          <div key={year.year}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {year.year}학년
              </span>
              <span className="text-xs text-muted-foreground">
                {year.courses.length}개 과목
              </span>
            </div>
            <div className="space-y-2">
              {year.courses.map((c) => (
                <SubjectLink
                  key={c}
                  name={c}
                  year={year.year}
                  subject={major.subjects[c] ?? null}
                  fallbackDescription={major.courseDescriptions[c]}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CareersTab({ major, relatedJobs }: { major: FullMajor; relatedJobs: Job[] }) {
  return (
    <div className="space-y-4">
      {/* ── 커리어넷 관련 직업 ────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-accent" />
            <CardTitle>관련 직업</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {relatedJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">연결된 직업 정보가 없어요.</p>
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {relatedJobs.slice(0, 12).map((job) => (
                  <li key={job.job_cd}>
                    <Link
                      href={`/jobs/${job.job_cd}`}
                      className="group flex flex-col gap-1.5 rounded-lg border border-border bg-white p-3 transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold leading-snug group-hover:text-primary">
                          {job.job_nm}
                        </p>
                        {job.wage && (
                          <span className="shrink-0 text-[11px] text-muted-foreground">{job.wage}</span>
                        )}
                      </div>
                      {job.work && (
                        <p className="line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
                          {job.work}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              {relatedJobs.length > 12 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  +{relatedJobs.length - 12}개 더 있어요
                </p>
              )}
            </>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">출처: 커리어넷 직업정보</p>
        </CardContent>
      </Card>

      {/* ── 진출 분야 (industryKeywords 활용, AI 생성) ──────────────── */}
      {major.industryKeywords && major.industryKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <CardTitle className="text-base">진출 분야</CardTitle>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                AI 생성
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {major.industryKeywords.map((k) => (
                <Badge key={k} variant="secondary">
                  #{k}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {major.certifications && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">관련 자격증</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {major.certifications.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {major.gradSchoolOptions && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">진학(대학원) 옵션</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-foreground/85">
                {major.gradSchoolOptions.map((g) => (
                  <li key={g} className="flex gap-1.5">
                    <span className="text-accent">·</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function OutlookBadge({ outlook }: { outlook: IndustryOutlook }) {
  const config = {
    GROWING: { label: "성장", className: "bg-emerald-100 text-emerald-700", Icon: TrendingUp },
    STABLE: { label: "유지", className: "bg-sky-100 text-sky-700", Icon: Workflow },
    DECLINING: { label: "축소", className: "bg-orange-100 text-orange-700", Icon: TrendingDown },
    TRANSFORMING: { label: "변화", className: "bg-purple-100 text-purple-700", Icon: Sparkles },
  }[outlook.direction];
  const { Icon } = config;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" /> 향후 전망: {config.label}
    </span>
  );
}

// ── AI 위험도 설명 ────────────────────────────────────────────────────────
const RISK_DESC: Record<RiskLevel, string> = {
  low: "AI 대체 가능성이 낮아 안정적인 수요 전망",
  medium: "일부 업무 자동화 가능, 전문성 강화 필요",
  high: "AI 자동화 영향이 클 것으로 예상, 차별화 역량 필요",
};

function IndustryTab({ major, relatedJobs }: { major: FullMajor; relatedJobs: Job[] }) {
  // ── 관련 직업 AI 위험도 평균 계산 ──────────────────────────────────────
  const riskEntries = relatedJobs
    .map((j) => getAiRisk(j.job_cd))
    .filter((r): r is NonNullable<ReturnType<typeof getAiRisk>> => r !== null);

  const avgRate =
    riskEntries.length > 0
      ? riskEntries.reduce((s, r) => s + r.rate_2024, 0) / riskEntries.length
      : null;

  const overallLevel: RiskLevel | null =
    avgRate === null ? null : avgRate < 30 ? "low" : avgRate < 70 ? "medium" : "high";

  const hasRiskData = overallLevel !== null;

  if (!major.industryTrends && !major.outlook && !hasRiskData) {
    return <EmptyState text="아직 보강 중인 데이터예요." />;
  }

  return (
    <div className="space-y-4">
      {/* ── 관련 직업군 AI 대체 위험도 (실제 데이터) ─────────────────── */}
      {hasRiskData && (() => {
        const meta = RISK_META[overallLevel!];
        return (
          <Card className={cn("border", meta.border, meta.bg)}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">관련 직업군 AI 대체 위험도</CardTitle>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                    meta.bg,
                    meta.color,
                    "border",
                    meta.border,
                  )}
                >
                  {meta.emoji} {meta.label}
                </span>
              </div>
              <p className={cn("mt-1 text-sm font-medium", meta.color)}>
                {RISK_DESC[overallLevel!]}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  분석 직업 수:{" "}
                  <strong className="text-foreground">{riskEntries.length}개</strong>
                </span>
                <span>
                  평균 AI 대체율:{" "}
                  <strong className="text-foreground">{Math.round(avgRate!)}%</strong>
                </span>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                출처: 한국고용정보원 AI 대체율 보고서 (2025.04)
              </p>
            </CardContent>
          </Card>
        );
      })()}

      {/* ── AI 생성 참고 전망 (기존 outlook → 하향 배치) ─────────────── */}
      {major.outlook && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">
                {hasRiskData ? "AI 생성 참고 전망" : "산업 전망"}
              </CardTitle>
              {hasRiskData && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  AI 생성
                </span>
              )}
              <OutlookBadge outlook={major.outlook} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {major.outlook.summary}
            </p>
          </CardHeader>
        </Card>
      )}

      {major.industryTrends && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">현재 트렌드</CardTitle>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                AI 생성
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              지금 이 산업에서 가장 주목받는 흐름들이에요.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm text-foreground/85">
              {major.industryTrends.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="flex-1 leading-relaxed">{t}</span>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(major.name + " " + t + " 최신")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    관련 영상 보기 ▶
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {major.industryKeywords && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">주목할 키워드</CardTitle>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                AI 생성
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {major.industryKeywords.map((k) => (
                <Badge key={k} variant="default">
                  #{k}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActivitiesTab({ major }: { major: FullMajor }) {
  if (!major.activities && !major.books) {
    return <EmptyState text="아직 보강 중인 데이터예요." />;
  }

  const typeLabel: Record<string, string> = {
    CLUB: "동아리",
    CONTEST: "대회",
    VOLUNTEER: "봉사",
    READING: "독서",
    PROJECT: "프로젝트",
  };

  return (
    <div className="space-y-4">
      {major.activities && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">고등학생 때 해두면 좋은 활동</CardTitle>
            <p className="text-xs text-muted-foreground">
              생활기록부와 자기소개서에서 빛이 날 수 있는 활동들을 추천해요.
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {major.activities.map((a, i) => (
              <div key={i} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{typeLabel[a.type] ?? a.type}</Badge>
                  <span className="text-sm font-semibold">{a.title}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {major.books && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">추천 도서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {major.books.map((b, i) => (
              <div key={i} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold">『{b.title}』</span>
                  <span className="text-xs text-muted-foreground">{b.author}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {b.summary}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function UniversitiesTab({ major }: { major: FullMajor }) {
  if (major.universities.length === 0) {
    return <EmptyState text="등록된 대학 정보가 없어요." />;
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-accent" />
          <CardTitle>이 학과를 개설한 대학</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          총 {major.universities.length}개 대학에서 모집합니다
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {major.universities.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2.5"
            >
              <div>
                <div className="text-sm font-medium">{u.name}</div>
                <div className="text-xs text-muted-foreground">
                  <Map className="mr-1 inline h-3 w-3" />
                  {u.region}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">정원</div>
                <div className="text-sm font-semibold">{u.admissionQuota}명</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
