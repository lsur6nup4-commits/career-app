"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { UNIVERSITY_TYPE_LABEL } from "@/lib/universities";
import { cn } from "@/lib/utils";
import type { Major, University, UniversityMajor } from "@/types/major";

type Props = {
  universities: University[];
  regions: string[];
  majors: Major[];
  universityMajors: UniversityMajor[];
};

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "전체", label: "전체" },
  { value: "NATIONAL", label: "국립" },
  { value: "PRIVATE", label: "사립" },
  { value: "SPECIAL", label: "특수" },
];

export function UniversitySearch({
  universities,
  regions,
  majors,
  universityMajors,
}: Props) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("전체");
  const [type, setType] = useState("전체");
  const [majorId, setMajorId] = useState("");

  const uniIdsByMajor = useMemo(() => {
    if (!majorId) return null;
    return new Set(
      universityMajors
        .filter((um) => um.majorId === majorId)
        .map((um) => um.universityId),
    );
  }, [majorId, universityMajors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return universities.filter((u) => {
      if (
        q &&
        !u.name.toLowerCase().includes(q) &&
        !u.shortName.toLowerCase().includes(q)
      )
        return false;
      if (region !== "전체" && u.region !== region) return false;
      if (type !== "전체" && u.type !== type) return false;
      if (uniIdsByMajor && !uniIdsByMajor.has(u.id)) return false;
      return true;
    });
  }, [universities, query, region, type, uniIdsByMajor]);

  const selectedMajor = majors.find((m) => m.id === majorId);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='대학명으로 검색 (예: "서울대", "부산대", "포항")'
          className="pl-9"
          aria-label="대학 검색"
        />
      </div>

      <div className="space-y-2">
        <FilterRow label="지역">
          {["전체", ...regions].map((r) => (
            <Chip
              key={r}
              active={region === r}
              onClick={() => setRegion(r)}
              label={r}
            />
          ))}
        </FilterRow>
        <FilterRow label="유형">
          {TYPE_OPTIONS.map((t) => (
            <Chip
              key={t.value}
              active={type === t.value}
              onClick={() => setType(t.value)}
              label={t.label}
            />
          ))}
        </FilterRow>
        <FilterRow label="개설 학과">
          <select
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="개설 학과 선택"
          >
            <option value="">전체 학과</option>
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {selectedMajor && (
            <button
              type="button"
              onClick={() => setMajorId("")}
              className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
              aria-label="학과 필터 제거"
            >
              {selectedMajor.name} <X className="h-3 w-3" />
            </button>
          )}
        </FilterRow>
      </div>

      <p className="text-xs text-muted-foreground">
        총{" "}
        <span className="font-semibold text-foreground">{filtered.length}</span>
        개 대학
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="검색 결과가 없어요"
          description="다른 키워드나 필터로 다시 시도해보세요."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {filtered.map((u) => (
            <li key={u.id}>
              <Link
                href={`/universities/${u.id}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="h-full transition-shadow group-hover:shadow-card">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-tight group-hover:text-primary">
                          {u.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            {u.region}
                          </span>
                          <Badge variant="secondary">
                            {UNIVERSITY_TYPE_LABEL[u.type]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}
