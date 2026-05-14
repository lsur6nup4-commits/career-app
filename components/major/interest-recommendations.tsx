"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { loadProfile, getConfirmedInterests } from "@/lib/interests/storage";
import { rankMajorsByInterests } from "@/lib/interests/matcher";
import type { Major } from "@/types/major";

const MAX_CARDS = 10;
/** w-44(176px) + gap-3(12px) */
const SCROLL_STEP = 188;

type CardItem = { major: Major; matched: string[] };

export function InterestRecommendations({ majors }: { majors: Major[] }) {
  const [items, setItems] = useState<CardItem[]>([]);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profile = loadProfile();
    const confirmed = getConfirmedInterests(profile);
    if (confirmed.length === 0) return;

    const ranked = rankMajorsByInterests(majors, confirmed).slice(0, MAX_CARDS);
    setItems(ranked.map(({ major, matched }) => ({ major, matched })));
  }, [majors]);

  const syncArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // 아이템이 채워진 후 화살표 상태 초기화
  useEffect(() => {
    // rAF 한 틱 뒤 측정 (렌더 완료 후)
    const id = requestAnimationFrame(syncArrows);
    return () => cancelAnimationFrame(id);
  }, [items]);

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? SCROLL_STEP : -SCROLL_STEP,
      behavior: "smooth",
    });
  };

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

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {items.length}개 학과
          </span>
          {/* 화살표 버튼 */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canLeft}
              aria-label="이전 학과 보기"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canRight}
              aria-label="다음 학과 보기"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-default disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 가로 스크롤 영역 */}
      <div
        ref={scrollRef}
        onScroll={syncArrows}
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
