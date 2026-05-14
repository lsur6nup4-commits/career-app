import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobAiRisk, RiskLevel } from "@/lib/ai-risk";
import { RISK_META } from "@/lib/ai-risk";

// ── 단일 연도 위험도 셀 ───────────────────────────────────────────────────
function RiskCell({
  year,
  rate,
  level,
}: {
  year: string;
  rate: number;
  level: RiskLevel;
}) {
  const meta = RISK_META[level];
  // 프로그레스 바: 최대 기준을 95로 맞춰 시각적 비율 조정
  const barPct = Math.round((rate / 95) * 100);

  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-2 rounded-xl border p-4",
        meta.bg,
        meta.border,
      )}
    >
      <p className="text-xs font-semibold text-muted-foreground">{year}</p>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black tabular-nums" style={{ lineHeight: 1 }}>
          {rate}
          <span className="text-base font-bold">%</span>
        </span>
      </div>

      <div
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
          meta.bg,
          meta.color,
        )}
      >
        {meta.emoji} {meta.label}
      </div>

      {/* 게이지 바 */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            level === "low"    && "bg-emerald-500",
            level === "medium" && "bg-amber-500",
            level === "high"   && "bg-red-500",
          )}
          style={{ width: `${barPct}%` }}
          role="progressbar"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={95}
        />
      </div>
    </div>
  );
}

// ── 메인 카드 ─────────────────────────────────────────────────────────────
export function AiRiskCard({ risk }: { risk: JobAiRisk }) {
  const isActual = risk.source === "actual";
  const trend = risk.rate_2027 - risk.rate_2024;
  const trendLabel =
    trend > 5 ? "↑ 위험도 상승 예상" : trend < -5 ? "↓ 위험도 감소 예상" : "→ 유사한 수준 유지";
  const trendColor =
    trend > 5
      ? "text-red-600 dark:text-red-400"
      : trend < -5
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground";

  return (
    <section aria-labelledby="ai-risk-heading" className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2
        id="ai-risk-heading"
        className="mb-1 flex items-center gap-2 text-base font-bold"
      >
        <Bot className="h-5 w-5 text-primary" />
        AI 자동화 위험도
      </h2>
      <p className={cn("mb-4 text-xs font-medium", trendColor)}>{trendLabel}</p>

      {/* 2024 / 2027 나란히 */}
      <div className="flex gap-3">
        <RiskCell year="2025년 보고서 기준" rate={risk.rate_2024} level={risk.risk_2024} />
        <RiskCell year="2027년 전망" rate={risk.rate_2027} level={risk.risk_2027} />
      </div>

      {/* 설명 */}
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        수치는 해당 직업의 업무 중 AI로 대체될 수 있는 비율입니다.
        저위험(&lt;30%) · 중위험(30–69%) · 고위험(≥70%)
      </p>

      {/* 출처 */}
      <p className="mt-2 text-[11px] text-muted-foreground">
        {isActual ? (
          <>출처: <strong>한국고용정보원</strong> (2025.04 발표)</>
        ) : (
          <span className="inline-flex items-center gap-1">
            <span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              AI 추정
            </span>
            보고서 기반 추정치 — 실제와 다를 수 있어요
          </span>
        )}
      </p>
    </section>
  );
}
