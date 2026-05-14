"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import majorsJson from "@/seed/majors.json";
import { Badge } from "@/components/ui/badge";
import { loadResult } from "@/lib/diagnosis/storage";
import { useHydrated } from "@/stores/use-hydrated";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { Major } from "@/types/major";

const ALL_MAJORS = majorsJson as Major[];
const MAJOR_BY_ID = Object.fromEntries(ALL_MAJORS.map((m) => [m.id, m]));

// Curated fallback list when the user hasn't completed the diagnosis yet.
const POPULAR_FALLBACK = [
  "computer-science",
  "business",
  "medicine",
  "psychology",
  "design",
  "media-communication",
  "electrical-engineering",
  "mechanical-engineering",
];

type Item = { major: Major; score?: number };

export function RecommendationCarousel() {
  const hydrated = useHydrated();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResult(loadResult());
  }, []);

  let items: Item[];
  let mode: "personalized" | "popular";

  if (hydrated && result?.topMajors?.length) {
    items = result.topMajors
      .slice(0, 8)
      .flatMap<Item>((m) => {
        const major = MAJOR_BY_ID[m.majorId];
        return major ? [{ major, score: m.score }] : [];
      });
    mode = "personalized";
  } else {
    items = POPULAR_FALLBACK.flatMap<Item>((id) => {
      const major = MAJOR_BY_ID[id];
      return major ? [{ major }] : [];
    });
    mode = "popular";
  }

  const syncArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const id = requestAnimationFrame(syncArrows);
    return () => cancelAnimationFrame(id);
  }, [hydrated, result]);

  const scrollBy = (dir: "left" | "right") => {
    // sm:basis-72 = 288px + gap-3(12px) = 300px
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <section aria-labelledby="recs-heading">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
            {mode === "personalized" ? (
              <>
                <Sparkles className="h-3.5 w-3.5" /> 진단 기반 맞춤 추천
              </>
            ) : (
              <>
                <TrendingUp className="h-3.5 w-3.5" /> 학생들이 많이 찾는 학과
              </>
            )}
          </div>
          <h2 id="recs-heading" className="mt-0.5 text-lg font-bold tracking-tight">
            {mode === "personalized"
              ? "나에게 맞는 학과"
              : "인기 학과 둘러보기"}
          </h2>
        </div>

        {/* 전체 보기 + 화살표 */}
        <div className="flex items-center gap-2">
          <Link
            href="/majors"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            전체 보기 →
          </Link>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canLeft}
              aria-label="이전 학과 보기"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canRight}
              aria-label="다음 학과 보기"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-default disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={syncArrows}
        className="-mx-4 overflow-x-auto px-4 no-scrollbar"
      >
        <ul className="flex snap-x snap-mandatory gap-3 pb-2">
          {items.map(({ major, score }) => (
            <li
              key={major.id}
              className="snap-start flex-shrink-0 basis-[78%] sm:basis-72"
            >
              <Link
                href={`/majors/${major.id}`}
                className="group block h-full rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="soft">{major.category}</Badge>
                  {typeof score === "number" && (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
                      적합도 {score}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-base font-bold group-hover:text-primary">
                  {major.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {major.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {major.keywords.slice(0, 3).map((k) => (
                    <Badge key={k} variant="outline">
                      #{k}
                    </Badge>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
