"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Major } from "@/types/major";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompareButton } from "@/components/major/compare-button";
import { cn } from "@/lib/utils";

type Props = {
  majors: Major[];
  categories: string[];
};

export function MajorSearch({ majors, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("전체");

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

  const allCategories = ["전체", ...categories];

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학과명, 키워드로 검색 (예: 컴퓨터, AI, 디자인)"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
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
        총 <span className="font-semibold text-foreground">{filtered.length}</span>개 학과
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
          검색 결과가 없어요. 다른 키워드로 시도해보세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((major) => (
            <Link key={major.id} href={`/majors/${major.id}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{major.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      평균 {major.averageGrade}등급
                    </span>
                  </div>
                  <CardTitle className="mt-1 group-hover:text-primary">
                    {major.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {major.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {major.keywords.slice(0, 4).map((k) => (
                      <Badge key={k} variant="outline">
                        #{k}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <CompareButton majorId={major.id} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
