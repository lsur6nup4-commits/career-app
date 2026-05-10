import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllMajors, getFullMajorById } from "@/lib/majors";
import { buildRoadmap } from "@/lib/roadmap";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllMajors().map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const major = getFullMajorById(id);
  if (!major) return { title: "로드맵을 찾을 수 없습니다" };
  return { title: `${major.name} 로드맵 — 진로나침반` };
}

export default async function RoadmapPage({ params }: Props) {
  const { id } = await params;
  const major = getFullMajorById(id);
  if (!major) notFound();

  const stages = buildRoadmap(major);

  return (
    <div className="space-y-6">
      <Link
        href={`/majors/${major.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {major.name} 상세로
      </Link>

      <header className="rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
            진로 로드맵
          </Badge>
          <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
            {major.category}
          </Badge>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {major.name} 진로 로드맵
        </h1>
        <p className="mt-2 text-sm text-white/85">
          고등학교부터 졸업 후 진로까지, 학과별 데이터를 기반으로 단계별 가이드를 제안해요.
        </p>
      </header>

      <RoadmapTimeline stages={stages} />

      <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        이 로드맵은 학과 데이터로 자동 구성된 참고용 가이드예요.
        실제 일정은 학교·전형·개인 상황에 따라 다를 수 있어요.
      </div>
    </div>
  );
}
