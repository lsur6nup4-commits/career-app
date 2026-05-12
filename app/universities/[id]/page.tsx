import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import {
  UNIVERSITY_TYPE_LABEL,
  getAllUniversities,
  getUniversityById,
} from "@/lib/universities";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AdmissionDonut } from "@/components/university/admission-donut";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllUniversities().map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const u = getUniversityById(id);
  if (!u) return { title: "대학을 찾을 수 없어요" };
  return { title: `${u.name} — 진로나침반` };
}

export default async function UniversityDetailPage({ params }: Props) {
  const { id } = await params;
  const u = getUniversityById(id);
  if (!u) notFound();

  const grouped = u.majors.reduce<Record<string, typeof u.majors>>((acc, m) => {
    (acc[m.category] = acc[m.category] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Link
        href="/universities"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 대학 목록으로
      </Link>

      <header className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{UNIVERSITY_TYPE_LABEL[u.type]}</Badge>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {u.region}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {u.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          학과 데이터는 추후 공공 API와 연동되어 실제 입학 정원·전형 정보로 업데이트될 예정이에요.
        </p>
      </header>

      {/* ── 정시·수시 비율 ────────────────────────────────────────────── */}
      <section aria-labelledby="admission-heading">
        <h2 id="admission-heading" className="mb-3 text-lg font-semibold">
          전형 비율
        </h2>
        <Card className="p-5 sm:p-6">
          <AdmissionDonut
            majors={u.majors.map((m) => ({
              jeongsiRatio: m.jeongsiRatio,
              susiRatio: m.susiRatio,
            }))}
          />
        </Card>
      </section>

      <section aria-labelledby="majors-heading">
        <h2 id="majors-heading" className="mb-3 text-lg font-semibold">
          개설 학과 ({u.majors.length})
        </h2>
        {u.majors.length === 0 ? (
          <EmptyState
            title="등록된 학과가 없어요"
            description="이 대학의 학과 데이터는 곧 업데이트될 예정이에요."
          />
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([cat, list]) => (
              <div key={cat}>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  {cat} ({list.length})
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {list.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/majors/${m.id}`}
                        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Card className="h-full transition-shadow group-hover:shadow-card">
                          <div className="flex items-center justify-between gap-2 p-3.5">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold group-hover:text-primary">
                                {m.name}
                              </div>
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {m.summary}
                              </p>
                            </div>
                            {typeof m.admissionQuota === "number" && (
                              <div className="flex-shrink-0 text-right">
                                <div className="text-[10px] text-muted-foreground">
                                  정원
                                </div>
                                <div className="text-sm font-semibold">
                                  {m.admissionQuota}명
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
