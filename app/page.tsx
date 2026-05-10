import Link from "next/link";
import {
  ArrowRight,
  Compass,
  GraduationCap,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { RecommendationCarousel } from "@/components/home/recommendation-carousel";
import { PopularQuestions } from "@/components/home/popular-questions";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-7 text-primary-foreground shadow-glow sm:p-10"
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            한국 고등학생을 위한 진로 가이드
          </span>
          <h1
            id="hero-heading"
            className="text-3xl font-bold leading-tight sm:text-[40px]"
          >
            나에게 맞는 진로,
            <br />
            <span className="text-white/95">5분이면 찾을 수 있어요.</span>
          </h1>
          <p className="text-sm text-white/85 sm:text-base">
            진단으로 나의 성향을 알고, 맞춤 학과를 살펴보고,
            <br className="hidden sm:inline" />
            AI 상담사에게 무엇이든 물어보세요.
          </p>

          <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:gap-3">
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-base font-bold text-primary shadow-soft transition-transform hover:scale-[1.02]"
            >
              5분 진단 시작하기 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/majors"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-base font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              학과 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* 3 핵심 기능 */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          핵심 기능
        </h2>
        <ul className="grid grid-cols-3 gap-3">
          <FeatureLink href="/diagnosis" Icon={Compass} title="진단" sub="5분 32문항" />
          <FeatureLink
            href="/majors"
            Icon={GraduationCap}
            title="학과 백과"
            sub="30개 학과"
          />
          <FeatureLink
            href="/chat"
            Icon={MessageCircle}
            title="AI 상담"
            sub="실시간"
          />
        </ul>
      </section>

      {/* 추천 학과 캐러셀 */}
      <RecommendationCarousel />

      {/* 인기 질문 */}
      <PopularQuestions />
    </div>
  );
}

function FeatureLink({
  href,
  Icon,
  title,
  sub,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  sub: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex h-full flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </Link>
    </li>
  );
}
