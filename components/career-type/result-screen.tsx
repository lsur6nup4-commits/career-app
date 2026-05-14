"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Download,
  GraduationCap,
  Briefcase,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import { getCareerType, getRecommendedMajors } from "@/lib/career-types";
import { getJobsForMajor } from "@/lib/jobs";
import jobsJson from "@/seed/jobs.json";
import type { QuizResult } from "@/types/career-type";
import { AXIS_PAIRS } from "@/types/career-type";
import { cn } from "@/lib/utils";

const allJobs = jobsJson as Array<{ job_cd: number; job_nm: string; wage: string; top_nm: string }>;

// ── html2canvas 지연 로드 ────────────────────────────────────────────────
async function captureAndSave(el: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, {
    useCORS: true,
    scale: 2,
    backgroundColor: null,
    logging: false,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ── 공유 카드 (html2canvas 대상 — inline styles 전용) ────────────────────
function ShareCard({
  cardRef,
  result,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  result: QuizResult;
}) {
  const type = getCareerType(result.typeCode)!;

  return (
    <div
      ref={cardRef}
      style={{
        width: "360px",
        padding: "32px",
        borderRadius: "20px",
        backgroundColor: type.colorBg,
        fontFamily:
          "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "18px" }}>🧭</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280" }}>진로나침반</span>
        </div>
        <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>진로 유형 검사</span>
      </div>

      {/* 유형 */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "56px", lineHeight: 1, marginBottom: "8px" }}>{type.emoji}</div>
        <div style={{ fontSize: "36px", fontWeight: 900, color: type.color, letterSpacing: "-1px" }}>
          {type.code}
        </div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginTop: "4px" }}>
          {type.nickname}
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px", lineHeight: 1.5 }}>
          {type.tagline}
        </div>
      </div>

      {/* 4축 그래프 */}
      <div style={{ marginBottom: "20px" }}>
        {AXIS_PAIRS.map((pair) => {
          const sa = result.scores[pair.a as keyof typeof result.scores];
          const sb = result.scores[pair.b as keyof typeof result.scores];
          const total = sa + sb || 1;
          const pct = Math.round((sa / total) * 100);
          const winnerA = sa >= sb;
          return (
            <div key={pair.a} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                <span style={{ color: winnerA ? type.color : "#9ca3af" }}>
                  {pair.a} {pair.nameA}
                </span>
                <span style={{ color: !winnerA ? type.color : "#9ca3af" }}>
                  {pair.nameB} {pair.b}
                </span>
              </div>
              <div style={{ height: "8px", borderRadius: "4px", backgroundColor: "#e5e7eb", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: "4px", backgroundColor: type.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 강점 */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {type.strengths.map((s, i) => (
          <span
            key={i}
            style={{
              backgroundColor: type.color,
              color: "#fff",
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 결과 화면 본체 ────────────────────────────────────────────────────────
export function ResultScreen({
  result,
  onRetry,
}: {
  result: QuizResult;
  onRetry: () => void;
}) {
  const type = getCareerType(result.typeCode);
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  if (!type) return null;

  const recMajors = getRecommendedMajors(type);
  const recJobs = type.recommendedJobs
    .map((rj) => allJobs.find((j) => j.job_cd === rj.jobCd))
    .filter(Boolean);

  async function handleSave() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await captureAndSave(
        cardRef.current,
        `진로유형_${type!.code}_${type!.nickname}.png`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="animate-scale-in space-y-5 py-4">

      {/* ── 공유 카드 ──────────────────────────────────────────────── */}
      <div className="flex justify-center overflow-hidden rounded-2xl">
        <ShareCard cardRef={cardRef} result={result} />
      </div>

      {/* ── 액션 버튼 ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          이미지 저장
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <RotateCcw className="h-5 w-5" />
          다시 검사
        </button>
        <Link
          href="/career-type/all"
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <LayoutGrid className="h-5 w-5" />
          16가지 유형
        </Link>
      </div>

      {/* ── 설명 ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-2 text-sm font-bold">유형 설명</h3>
        <p className="text-sm leading-relaxed text-foreground/85">
          {type.description}
        </p>
      </div>

      {/* ── 추천 학과 ─────────────────────────────────────────────── */}
      <section aria-labelledby="rec-majors-heading">
        <h3
          id="rec-majors-heading"
          className="mb-3 flex items-center gap-1.5 text-sm font-bold"
        >
          <GraduationCap className="h-4 w-4 text-primary" />
          추천 학과
        </h3>
        <ul className="space-y-2">
          {recMajors.map((major, i) => (
            <li key={major.id}>
              <Link
                href={`/majors/${major.id}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: type.color }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold group-hover:text-primary">
                    {major.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {major.summary}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 추천 직업 ─────────────────────────────────────────────── */}
      <section aria-labelledby="rec-jobs-heading">
        <h3
          id="rec-jobs-heading"
          className="mb-3 flex items-center gap-1.5 text-sm font-bold"
        >
          <Briefcase className="h-4 w-4 text-primary" />
          추천 직업
        </h3>
        <ul className="space-y-2">
          {type.recommendedJobs.map((rj, i) => {
            const job = allJobs.find((j) => j.job_cd === rj.jobCd);
            return (
              <li key={rj.jobCd}>
                <Link
                  href={`/jobs/${rj.jobCd}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: type.color }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold group-hover:text-primary">
                      {rj.label}
                    </p>
                    {job?.wage && (
                      <p className="text-xs text-muted-foreground">
                        평균연봉 {job.wage}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── AI 고지 ───────────────────────────────────────────────── */}
      <p className="rounded-lg bg-muted/60 px-4 py-3 text-center text-[11px] leading-relaxed text-muted-foreground">
        본 유형 분석은 AI 기반 참고용입니다.
        전문 진로 상담사와 상담을 권장합니다.
      </p>

      {/* ── 하단 버튼 ─────────────────────────────────────────────── */}
      <div className="flex gap-2 pb-4">
        <button
          type="button"
          onClick={onRetry}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          다시 검사하기
        </button>
        <Link
          href="/career-type/all"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: type.color }}
        >
          <LayoutGrid className="h-4 w-4" />
          16가지 유형 보기
        </Link>
      </div>
    </div>
  );
}
