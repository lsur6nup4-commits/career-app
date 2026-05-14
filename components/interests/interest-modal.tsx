"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Plus, GraduationCap, Briefcase, Sparkles, Trash2 } from "lucide-react";
import {
  loadProfile,
  saveProfile,
  addInterestManually,
  removeInterest,
  getConfirmedInterests,
  clearProfile,
} from "@/lib/interests/storage";
import { MAJOR_KEYWORDS, JOB_KEYWORDS } from "@/lib/interests/keywords-data";
import type { DetectedInterest, InterestProfile } from "@/types/interests";
import { CONFIRM_THRESHOLD } from "@/types/interests";
import { cn } from "@/lib/utils";

// ── 카테고리 배지 ─────────────────────────────────────────────────────────
const CATEGORY_STYLE: Record<string, string> = {
  major: "bg-primary-soft/60 text-primary",
  job: "bg-accent/20 text-accent-foreground",
  concept: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  field: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};
const CATEGORY_LABEL: Record<string, string> = {
  major: "학과",
  job: "직업",
  concept: "개념",
  field: "분야",
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
        CATEGORY_STYLE[category] ?? "bg-muted text-muted-foreground",
      )}
    >
      {CATEGORY_LABEL[category] ?? category}
    </span>
  );
}

// ── 관심사 칩 ─────────────────────────────────────────────────────────────
function InterestChip({
  item,
  onRemove,
  onNavigate,
}: {
  item: DetectedInterest;
  onRemove: (kw: string) => void;
  onNavigate: () => void;
}) {
  const href =
    item.category === "major" && item.majorId
      ? `/majors/${item.majorId}`
      : item.category === "job" && item.jobId
        ? `/jobs/${item.jobId}`
        : item.category === "concept" || item.category === "field"
          ? `/majors?q=${encodeURIComponent(item.keyword)}`
          : null;

  // 학과 단위 그룹 칩 (matchedKeywords 있을 때 카드형)
  const hasMeta =
    item.category === "major" &&
    item.matchedKeywords &&
    item.matchedKeywords.length > 0;

  if (hasMeta) {
    return (
      <div className="w-full rounded-xl border border-border bg-card px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <CategoryBadge category={item.category} />
          {href ? (
            <Link
              href={href}
              onClick={onNavigate}
              className="flex-1 text-sm font-semibold hover:text-primary hover:underline underline-offset-2"
            >
              {item.keyword}
            </Link>
          ) : (
            <span className="flex-1 text-sm font-semibold">{item.keyword}</span>
          )}
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            ×{item.count}
          </span>
          <button
            type="button"
            onClick={() => onRemove(item.keyword)}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`${item.keyword} 제거`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        {/* 감지된 원본 키워드 */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {item.matchedKeywords!.slice(0, 5).map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 기본 pill 칩 (직업 · 분야 등)
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
      <CategoryBadge category={item.category} />
      {href ? (
        <Link
          href={href}
          onClick={onNavigate}
          className="font-medium hover:text-primary hover:underline underline-offset-2"
        >
          {item.keyword}
        </Link>
      ) : (
        <span className="font-medium">{item.keyword}</span>
      )}
      <span className="text-[11px] text-muted-foreground">×{item.count}</span>
      <button
        type="button"
        onClick={() => onRemove(item.keyword)}
        className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={`${item.keyword} 제거`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

// ── 관련 추천 카드 ────────────────────────────────────────────────────────
function RecommendSection({
  confirmed,
  onNavigate,
}: {
  confirmed: DetectedInterest[];
  onNavigate: () => void;
}) {
  // 1. major 카테고리 → 직접 학과 링크
  const majorInterests = confirmed.filter((i) => i.category === "major" && i.majorId);
  // 2. job 카테고리 → 직접 직업 링크
  const jobInterests = confirmed.filter((i) => i.category === "job" && i.jobId);
  // 3. concept/field 카테고리 → 학과 검색 링크
  const conceptInterests = confirmed
    .filter((i) => i.category === "concept" || i.category === "field")
    .slice(0, 3);

  const hasAny =
    majorInterests.length > 0 ||
    jobInterests.length > 0 ||
    conceptInterests.length > 0;

  if (!hasAny) return null;

  return (
    <div className="border-t border-border pt-4">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">
        관심사 기반 추천
      </p>
      <div className="space-y-2">
        {/* 직접 학과 링크 */}
        {majorInterests.slice(0, 3).map((i) => (
          <Link
            key={i.majorId}
            href={`/majors/${i.majorId}`}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:border-primary/40 hover:bg-primary-soft/20"
          >
            <GraduationCap className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="font-medium">{i.keyword}</span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              학과 보기 →
            </span>
          </Link>
        ))}

        {/* 직접 직업 링크 */}
        {jobInterests.slice(0, 3).map((i) => (
          <Link
            key={i.jobId}
            href={`/jobs/${i.jobId}`}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:border-accent/40 hover:bg-accent/10"
          >
            <Briefcase className="h-4 w-4 flex-shrink-0 text-accent-foreground" />
            <span className="font-medium">{i.keyword}</span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              직업 보기 →
            </span>
          </Link>
        ))}

        {/* 개념/분야 → 학과 검색 */}
        {conceptInterests.map((i) => (
          <Link
            key={i.keyword}
            href={`/majors?q=${encodeURIComponent(i.keyword)}`}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:border-primary/40 hover:bg-primary-soft/20"
          >
            <GraduationCap className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="flex-1 font-medium">{i.keyword}</span>
            <span className="text-[11px] text-muted-foreground">
              관련 학과 검색 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── 메인 모달 ─────────────────────────────────────────────────────────────
export function InterestModal({
  open,
  onClose,
  onProfileChange,
}: {
  open: boolean;
  onClose: () => void;
  onProfileChange?: (profile: InterestProfile) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<InterestProfile | null>(null);
  const [addInput, setAddInput] = useState("");
  const [tab, setTab] = useState<"confirmed" | "all">("confirmed");
  const overlayRef = useRef<HTMLDivElement>(null);

  // SSR 방지 — 클라이언트 마운트 후에만 portal 렌더링
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      setProfile(loadProfile());
      // 모달 열릴 때 body 스크롤 잠금
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function update(next: InterestProfile) {
    saveProfile(next);
    setProfile(next);
    onProfileChange?.(next);
  }

  function handleRemove(kw: string) {
    if (!profile) return;
    update(removeInterest(profile, kw));
  }

  function handleAdd() {
    const kw = addInput.trim();
    if (!kw || !profile) return;
    const majorMatch = MAJOR_KEYWORDS.find((m) => m.keyword === kw || m.id === kw);
    const jobMatch = JOB_KEYWORDS.find((j) => j.keyword === kw);
    const category = majorMatch ? "major" : jobMatch ? "job" : "field";
    update(
      addInterestManually(profile, {
        keyword: kw,
        category,
        majorId: majorMatch?.id,
        majorCategory: majorMatch?.category,
        jobId: jobMatch?.id,
      }),
    );
    setAddInput("");
  }

  function handleClearAll() {
    if (!confirm("모든 학습된 관심사를 초기화할까요?")) return;
    clearProfile();
    const fresh = loadProfile();
    setProfile(fresh);
    onProfileChange?.(fresh);
  }

  // 마운트 전이거나 닫혀 있으면 렌더 안 함
  if (!mounted || !open || !profile) return null;

  const confirmed = getConfirmedInterests(profile);
  const pending = profile.detectedInterests.filter((d) => d.count < CONFIRM_THRESHOLD);
  const displayList = tab === "confirmed" ? confirmed : profile.detectedInterests;

  // ── createPortal로 document.body에 직접 마운트 ──────────────────────────
  // header의 backdrop-filter가 fixed 자식의 containing block을 바꾸는 브라우저 버그 회피
  return createPortal(
    <>
      {/* 배경 딤처리 — 클릭 시 닫기 */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
        aria-hidden="true"
      />

      {/* 슬라이드업 패널 — fixed bottom-0 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="내 관심사"
        className="fixed inset-x-0 bottom-0 z-[201] rounded-t-3xl border-t border-border bg-background shadow-lift animate-slide-in-bottom"
        style={{ maxHeight: "80svh" }}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* 스크롤 영역 */}
        <div
          className="overflow-y-auto px-4 pb-10"
          style={{ maxHeight: "calc(80svh - 2rem)" }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h2 className="text-base font-bold">내 관심사</h2>
              <p className="text-xs text-muted-foreground">
                챗봇 대화에서 자동 학습 · 학과 단위 집계 · {CONFIRM_THRESHOLD}회 이상 확정
              </p>
            </div>
            <div className="flex items-center gap-2">
              {profile.detectedInterests.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-destructive"
                  title="전체 초기화"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 탭 */}
          <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {(["confirmed", "all"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "confirmed"
                  ? `확정 관심사 (${confirmed.length})`
                  : `전체 감지 (${profile.detectedInterests.length})`}
              </button>
            ))}
          </div>

          {/* 관심사 목록 */}
          {displayList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <Sparkles className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {tab === "confirmed"
                  ? "아직 확정된 관심사가 없어요"
                  : "아직 감지된 키워드가 없어요"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                AI 상담사와 대화하면 자동으로 학습됩니다
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayList.map((item) => (
                <div
                  key={item.majorId ?? item.keyword}
                  className={
                    item.category === "major" && item.matchedKeywords?.length
                      ? "w-full"
                      : ""
                  }
                >
                  <InterestChip
                    item={item}
                    onRemove={handleRemove}
                    onNavigate={onClose}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 미확정 안내 */}
          {tab === "all" && pending.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              아직 {CONFIRM_THRESHOLD}회 미달 학과 {pending.length}개 · 조금 더 대화하면 확정돼요.
            </p>
          )}

          {/* 직접 추가 */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="관심사 직접 추가..."
              className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!addInput.trim()}
              className="flex h-9 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> 추가
            </button>
          </div>

          {/* 추천 섹션 */}
          <div className="mt-4">
            <RecommendSection confirmed={confirmed} onNavigate={onClose} />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
