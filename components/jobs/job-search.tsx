"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Briefcase, TrendingUp, Heart } from "lucide-react";
import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";

// ── 배지 색상 헬퍼 ────────────────────────────────────────────────────────
function wageBadge(wage: string) {
  if (wage === "5천만원↑")
    return "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300";
  if (wage === "4천만원↑")
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (wage === "3천만원↑")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  return "bg-muted text-muted-foreground";
}

function wlbBadge(wlb: string) {
  if (wlb === "매우좋음")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (wlb === "좋음")
    return "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300";
  if (wlb === "보통")
    return "bg-muted text-muted-foreground";
  return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────
interface Props {
  jobs: Job[];
  categories: string[];
}

export function JobSearch({ jobs, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (q) {
        const hit =
          j.job_nm.toLowerCase().includes(q) ||
          j.rel_job_nm.toLowerCase().includes(q) ||
          j.aptit_name.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (category !== "전체" && j.top_nm !== category) return false;
      return true;
    });
  }, [jobs, query, category]);

  // 카테고리별 그룹
  const grouped = useMemo(() => {
    if (category !== "전체") {
      return { [category]: filtered };
    }
    return filtered.reduce<Record<string, Job[]>>((acc, j) => {
      (acc[j.top_nm] = acc[j.top_nm] || []).push(j);
      return acc;
    }, {});
  }, [filtered, category]);

  return (
    <div className="space-y-4">
      {/* ── 검색 + 필터 ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="직업명으로 검색..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            aria-label="직업 검색"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary/60"
          aria-label="직종 필터"
        >
          <option value="전체">전체 직종</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* ── 결과 수 ─────────────────────────────────────────────────── */}
      <p className="text-sm text-muted-foreground">
        {filtered.length}개 직업
        {query && (
          <span>
            {" "}
            · &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;
            검색 결과
          </span>
        )}
      </p>

      {/* ── 직업 목록 ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
          검색 결과가 없어요
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, list]) => (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h2
                id={`cat-${cat}`}
                className="mb-2 text-sm font-semibold text-muted-foreground"
              >
                {cat}{" "}
                <span className="font-normal">({list.length})</span>
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((job) => (
                  <li key={job.job_cd}>
                    <Link
                      href={`/jobs/${job.job_cd}`}
                      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-3.5 transition-shadow group-hover:shadow-card">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-snug group-hover:text-primary">
                            {job.job_nm}
                          </p>
                          {job.relatedMajors.length > 0 && (
                            <span
                              className="flex-shrink-0 rounded-full bg-primary-soft/60 px-2 py-0.5 text-[10px] font-medium text-primary"
                              title={`관련 학과 ${job.relatedMajors.length}개`}
                            >
                              학과 {job.relatedMajors.length}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {job.wage && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                wageBadge(job.wage),
                              )}
                            >
                              {job.wage}
                            </span>
                          )}
                          {job.wlb && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                wlbBadge(job.wlb),
                              )}
                            >
                              워라밸 {job.wlb}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <TrendingUp className="h-3 w-3" />
                            {job.views.toLocaleString("ko-KR")}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Heart className="h-3 w-3" />
                            {job.likes.toLocaleString("ko-KR")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
