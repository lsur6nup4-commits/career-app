"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { loadProfile, getConfirmedInterests } from "@/lib/interests/storage";
import { rankMajorsByInterests } from "@/lib/interests/matcher";
import type { Major } from "@/types/major";

const MAX_CARDS = 10;

type CardItem = { major: Major; matched: string[] };

export function InterestRecommendations({ majors }: { majors: Major[] }) {
  const [items, setItems] = useState<CardItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profile = loadProfile();
    const confirmed = getConfirmedInterests(profile);
    if (confirmed.length === 0) return;

    const ranked = rankMajorsByInterests(majors, confirmed).slice(0, MAX_CARDS);
    setItems(ranked.map(({ major, matched }) => ({ major, matched })));
  }, [majors]);

  if (items.length === 0) return null;

  return (
    <section className="space-y-3" aria-labelledby="interest-rec-heading">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2
          id="interest-rec-heading"
          className="flex items-center gap-1.5 text-base font-bold"
        >
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          내 관심사 기반 추천
        </h2>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {items.length}개 학과
        </span>
      </div>

      {/* 가로 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {items.map(({ major, matched }) => (
          <Link
            key={major.id}
            href={`/majors/${major.id}`}
            className="group flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="flex h-full w-44 flex-col gap-2 rounded-2xl border border-border bg-card p-3.5 transition-all group-hover:border-primary/40 group-hover:shadow-card">
              {/* 계열 배지 */}
              <span className="inline-flex w-fit rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {major.category}
              </span>

              {/* 학과명 */}
              <p className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                {major.name}
              </p>

              {/* 한줄 요약 */}
              <p className="line-clamp-2 flex-1 text-xs text-muted-foreground">
                {major.summary}
              </p>

              {/* 매칭 키워드 배지 */}
              <div className="flex flex-wrap gap-1">
                {matched.slice(0, 2).map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                  >
                    🎯 {kw}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="h-px bg-border" />
    </section>
  );
}
