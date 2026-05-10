"use client";

import { useState } from "react";
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
import { EmploymentPie } from "@/components/major/employment-pie";
import { cn } from "@/lib/utils";
import type { FullMajor, IndustryOutlook } from "@/types/major";

type TabKey = "curriculum" | "careers" | "industry" | "activities" | "universities";

const TABS: { key: TabKey; label: string }[] = [
  { key: "curriculum", label: "커리큘럼" },
  { key: "careers", label: "졸업 후 진로" },
  { key: "industry", label: "산업 현황" },
  { key: "activities", label: "추천 활동" },
  { key: "universities", label: "개설 대학" },
];

export function MajorTabs({ major }: { major: FullMajor }) {
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
      {tab === "careers" && <CareersTab major={major} />}
      {tab === "industry" && <IndustryTab major={major} />}
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
          학교마다 차이가 있어요. 일반적으로 배우는 과목 위주로 정리했습니다.
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
              {year.courses.map((c) => {
                const desc = major.courseDescriptions[c];
                return (
                  <div
                    key={c}
                    className="rounded-md border border-border bg-white px-3 py-2.5"
                  >
                    <div className="text-sm font-semibold">{c}</div>
                    {desc && (
                      <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {desc}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CareersTab({ major }: { major: FullMajor }) {
  if (!major.careers || major.careers.length === 0) {
    return <EmptyState text="아직 보강 중인 데이터예요." />;
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-accent" />
            <CardTitle>대표 직업</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            연봉은 워크넷·커리어넷 기준의 참고 수치(만원/년)예요.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {major.careers.map((c) => (
              <div
                key={c.name}
                className="rounded-lg border border-border bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="whitespace-nowrap text-xs font-bold text-primary">
                    ~{c.averageSalary.toLocaleString()}만원
                  </div>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {c.summary}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {major.employmentDistribution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">취업 분야 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <EmploymentPie data={major.employmentDistribution} />
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

function IndustryTab({ major }: { major: FullMajor }) {
  if (!major.industryTrends && !major.outlook) {
    return <EmptyState text="아직 보강 중인 데이터예요." />;
  }
  return (
    <div className="space-y-4">
      {major.outlook && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">산업 전망</CardTitle>
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
            <CardTitle className="text-base">현재 트렌드</CardTitle>
            <p className="text-xs text-muted-foreground">
              지금 이 산업에서 가장 주목받는 흐름들이에요.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-foreground/85">
              {major.industryTrends.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {major.industryKeywords && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">주목할 키워드</CardTitle>
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
