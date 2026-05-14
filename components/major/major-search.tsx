"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Major } from "@/types/major";
import type { DetectedInterest } from "@/types/interests";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompareButton } from "@/components/major/compare-button";
import { loadProfile, getConfirmedInterests } from "@/lib/interests/storage";
import { matchInterestsToMajor } from "@/lib/interests/matcher";
import { cn } from "@/lib/utils";

type Props = {
  majors: Major[];
  categories: string[];
  /** URL ?q= 파라미터로 넘어온 초기 검색어 */
  initialQuery?: string;
};

export function MajorSearch({ majors, categories, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>("전체");
  const [interests, setInterests] = useState<DetectedInterest[]>([]);

  // 관심사 읽기 (클라이언트 마운트 후)
  useEffect(() => {
    const profile = loadProfile();
    setInterests(getConfirmedInterests(profile));
  }, []);

  // URL initialQuery 변경에 반응 (Next.js soft navigation)
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return majors.filter((m) => {
      const matchCategory = category === "전체" || m.category === category;
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.keywords.some((k) => k.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [majors, query, category]);

  // 관심사 매칭이 있으면 매칭 수 내림차순으로 정렬
  const sortedFiltered = useMemo(() => {
    if (interests.length === 0) return filtered;
    return [...filtered].sort((a, b) => {
      const aScore = matchInterestsToMajor(a, interests).length;
      const bScore = matchInterestsToMajor(b, interests).length;
      return bScore - aScore;
    });
  }, [filtered, interests]);

  const allCategories = ["전체", ...categories];
  const hasInterests = interests.length > 0;

  return (
    <div className="space-y-5">
      {/* 검색창 */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학과명, 키워드로 검색 (예: 컴퓨터, AI, 디자인)"
          className="pl-9"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              category === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-foreground hover:bg-muted",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        총{" "}
        <span className="font-semibold text-foreground">{filtered.length}</span>
        개 학과
        {hasInterests && filtered.length > 0 && (
          <span className="ml-1 text-primary">· 🎯 관심사 매칭 순 정렬</span>
        )}
      </p>

      {/* 결과 */}
      {sortedFiltered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
          검색 결과가 없어요. 다른 키워드로 시도해보세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sortedFiltered.map((major) => {
            const matchedKws = hasInterests
              ? matchInterestsToMajor(major, interests)
              : [];
            const hasMatch = matchedKws.length > 0;

            return (
              <Link key={major.id} href={`/majors/${major.id}`} className="group">
                <Card
                  className={cn(
                    "h-full transition-shadow group-hover:shadow-md",
                    hasMatch && "border-primary/20",
                  )}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">{major.category}</Badge>
                      {hasMatch && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          🎯 관심사 일치
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-1 group-hover:text-primary">
                      {major.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {major.summary}
                    </p>

                    {/* 키워드 (매칭된 것 강조) */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {major.keywords.slice(0, 4).map((k) => {
                        const isHighlighted = matchedKws.some((mk) => {
                          const mklc = mk.toLowerCase();
                          const klc = k.toLowerCase();
                          return (
                            mklc === klc ||
                            mklc.includes(klc) ||
                            klc.includes(mklc)
                          );
                        });
                        return (
                          <Badge
                            key={k}
                            variant={isHighlighted ? "default" : "outline"}
                            className={
                              isHighlighted
                                ? "border-primary/30 bg-primary/15 text-primary hover:bg-primary/20"
                                : ""
                            }
                          >
                            #{k}
                          </Badge>
                        );
                      })}
                    </div>

                    {/* 매칭 키워드 안내 */}
                    {hasMatch && (
                      <p className="mt-1.5 text-[10px] text-muted-foreground">
                        관심사 키워드:{" "}
                        {matchedKws
                          .slice(0, 2)
                          .map((kw) => `"${kw}"`)
                          .join(", ")}
                      </p>
                    )}

                    <div className="mt-3 flex justify-end">
                      <CompareButton majorId={major.id} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
