"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { X, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { getAllCareerTypes, getRecommendedMajors } from "@/lib/career-types";
import jobsJson from "@/seed/jobs.json";
import type { CareerType } from "@/types/career-type";
import { cn } from "@/lib/utils";

const allJobs = jobsJson as Array<{ job_cd: number; job_nm: string; wage: string; top_nm: string }>;
const ALL_TYPES = getAllCareerTypes();

// ── 유형 카드 (그리드) ──────────────────────────────────────────────────────
function TypeCard({
  type,
  isSelected,
  onClick,
}: {
  type: CareerType;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all duration-150 active:scale-95",
        isSelected
          ? "border-[var(--type-color)] shadow-md"
          : "border-border bg-card hover:border-[var(--type-color)]/50 hover:shadow-soft",
      )}
      style={
        {
          "--type-color": type.color,
          backgroundColor: isSelected ? type.colorBg : undefined,
        } as React.CSSProperties
      }
      aria-pressed={isSelected}
    >
      <span className="text-3xl leading-none">{type.emoji}</span>
      <span
        className="text-base font-black tracking-tight"
        style={{ color: type.color }}
      >
        {type.code}
      </span>
      <span className="text-xs font-semibold text-foreground leading-tight">
        {type.nickname}
      </span>
    </button>
  );
}

// ── 상세 패널 ───────────────────────────────────────────────────────────────
function DetailPanel({
  type,
  onClose,
}: {
  type: CareerType;
  onClose: () => void;
}) {
  const recMajors = getRecommendedMajors(type);

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto rounded-t-3xl border-t border-border bg-background shadow-lift animate-slide-in-bottom"
        role="dialog"
        aria-modal="true"
        aria-label={`${type.code} ${type.nickname} 상세`}
      >
        {/* 드래그 핸들 */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border/50 bg-background/95 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{type.emoji}</span>
            <div>
              <span
                className="text-lg font-black tracking-tight"
                style={{ color: type.color }}
              >
                {type.code}
              </span>
              <span className="ml-2 text-sm font-semibold">{type.nickname}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-5 p-5 pb-10">
          {/* 태그라인 */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {type.tagline}
          </p>

          {/* 설명 */}
          <div
            className="rounded-2xl p-4 text-sm leading-relaxed"
            style={{ backgroundColor: type.colorBg }}
          >
            {type.description}
          </div>

          {/* 강점 */}
          <div className="flex flex-wrap gap-2">
            {type.strengths.map((s) => (
              <span
                key={s}
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: type.color }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* 추천 학과 */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <GraduationCap className="h-4 w-4 text-primary" />
              추천 학과
            </h4>
            <ul className="space-y-1.5">
              {recMajors.map((major, i) => (
                <li key={major.id}>
                  <Link
                    href={`/majors/${major.id}`}
                    className="group flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card"
                    onClick={onClose}
                  >
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: type.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium group-hover:text-primary">
                      {major.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 추천 직업 */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Briefcase className="h-4 w-4 text-primary" />
              추천 직업
            </h4>
            <ul className="space-y-1.5">
              {type.recommendedJobs.map((rj, i) => {
                const job = allJobs.find((j) => j.job_cd === rj.jobCd);
                return (
                  <li key={rj.jobCd}>
                    <Link
                      href={`/jobs/${rj.jobCd}`}
                      className="group flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card"
                      onClick={onClose}
                    >
                      <span
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                        style={{ backgroundColor: type.color }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium group-hover:text-primary">
                          {rj.label}
                        </p>
                        {job?.wage && (
                          <p className="text-xs text-muted-foreground">
                            평균연봉 {job.wage}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 검사 받기 CTA */}
          <Link
            href="/career-type"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: type.color }}
            onClick={onClose}
          >
            내 유형 검사하러 가기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

// ── 메인 클라이언트 컴포넌트 ────────────────────────────────────────────────
export function AllTypesClient() {
  const [selected, setSelected] = useState<CareerType | null>(null);

  const handleSelect = useCallback((type: CareerType) => {
    setSelected((prev) => (prev?.code === type.code ? null : type));
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      {/* 16유형 그리드 */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
        {ALL_TYPES.map((type) => (
          <TypeCard
            key={type.code}
            type={type}
            isSelected={selected?.code === type.code}
            onClick={() => handleSelect(type)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        유형을 탭하면 상세 설명을 볼 수 있어요
      </p>

      {/* 상세 패널 */}
      {selected && (
        <DetailPanel type={selected} onClose={handleClose} />
      )}
    </>
  );
}
