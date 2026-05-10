import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Map } from "lucide-react";
import { getAllMajors, getFullMajorById } from "@/lib/majors";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MajorTabs } from "@/components/major/major-tabs";
import { CompareButton } from "@/components/major/compare-button";
import { BookmarkButton } from "@/components/major/bookmark-button";
import { formatPercent } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllMajors().map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const major = getFullMajorById(id);
  if (!major) return { title: "학과를 찾을 수 없습니다" };
  return { title: `${major.name} — 진로나침반` };
}

export default async function MajorDetailPage({ params }: Props) {
  const { id } = await params;
  const major = getFullMajorById(id);
  if (!major) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/majors"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 학과 목록으로
      </Link>

      <header className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{major.category}</Badge>
          {major.hollandTags.map((tag) => (
            <Badge key={tag} variant="outline">
              Holland · {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {major.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{major.summary}</p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          {major.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {major.keywords.map((k) => (
            <Badge key={k} variant="outline">
              #{k}
            </Badge>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <BookmarkButton majorId={major.id} size="md" />
          <CompareButton majorId={major.id} size="md" />
          <Link
            href={`/roadmap/${major.id}`}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            <Map className="h-3.5 w-3.5" /> 로드맵 보기
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader>
            <p className="text-xs text-muted-foreground">평균 입시 등급</p>
            <CardTitle className="text-2xl">{major.averageGrade}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs text-muted-foreground">정시 비율</p>
            <CardTitle className="text-2xl">{formatPercent(major.jeongsiRatio)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs text-muted-foreground">수시 비율</p>
            <CardTitle className="text-2xl">{formatPercent(major.susiRatio)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <MajorTabs major={major} />
    </div>
  );
}
