/**
 * AdmissionDonut — 정시·수시 비율 도넛 차트 (Server Component / pure SVG)
 *
 * 학과별 jeongsiRatio·susiRatio 를 평균 내어 2-세그먼트 도넛으로 표시합니다.
 * Recharts 의존 없이 순수 SVG로 구현해 번들 크기 영향이 없습니다.
 */

import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type MajorRatios = {
  jeongsiRatio: number;
  susiRatio: number;
};

// ── SVG 헬퍼 ──────────────────────────────────────────────────────────────

function toCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: parseFloat((cx + r * Math.cos(rad)).toFixed(4)),
    y: parseFloat((cy + r * Math.sin(rad)).toFixed(4)),
  };
}

/**
 * SVG 도넛 세그먼트 path 문자열 생성.
 * sweepDeg 가 0 이하면 null 을 반환합니다.
 */
function donutPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startDeg: number,
  sweepDeg: number,
): string | null {
  if (sweepDeg <= 0) return null;

  // 360° 에 가까우면 두 반호로 분리 (단일 호로는 SVG arc가 degenerate)
  if (sweepDeg >= 359.5) {
    const o0 = toCartesian(cx, cy, outer, 0);
    const o180 = toCartesian(cx, cy, outer, 180);
    const i0 = toCartesian(cx, cy, inner, 0);
    const i180 = toCartesian(cx, cy, inner, 180);
    return [
      `M${o0.x},${o0.y}`,
      `A${outer},${outer},0,1,1,${o180.x},${o180.y}`,
      `A${outer},${outer},0,1,1,${o0.x},${o0.y}Z`,
      `M${i0.x},${i0.y}`,
      `A${inner},${inner},0,1,0,${i180.x},${i180.y}`,
      `A${inner},${inner},0,1,0,${i0.x},${i0.y}Z`,
    ].join(" ");
  }

  const endDeg = startDeg + sweepDeg;
  const os = toCartesian(cx, cy, outer, startDeg);
  const oe = toCartesian(cx, cy, outer, endDeg);
  const ie = toCartesian(cx, cy, inner, endDeg);
  const is_ = toCartesian(cx, cy, inner, startDeg);
  const large = sweepDeg > 180 ? 1 : 0;

  return [
    `M${os.x},${os.y}`,
    `A${outer},${outer},0,${large},1,${oe.x},${oe.y}`,
    `L${ie.x},${ie.y}`,
    `A${inner},${inner},0,${large},0,${is_.x},${is_.y}`,
    "Z",
  ].join(" ");
}

// ── 컴포넌트 ───────────────────────────────────────────────────────────────

export function AdmissionDonut({ majors }: { majors: MajorRatios[] }) {
  // ── 데이터 없음 ────────────────────────────────────────────────────────
  if (majors.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="전형 데이터가 없어요"
        description="이 대학의 정시·수시 비율 데이터는 추후 업데이트될 예정이에요."
        className="py-8"
      />
    );
  }

  // ── 평균 산출 ──────────────────────────────────────────────────────────
  const n = majors.length;
  const avgSusi = majors.reduce((s, m) => s + (m.susiRatio ?? 0), 0) / n;
  const avgJeongsi = majors.reduce((s, m) => s + (m.jeongsiRatio ?? 0), 0) / n;
  const total = avgSusi + avgJeongsi;

  if (total < 0.001) {
    return (
      <EmptyState
        icon={BarChart3}
        title="전형 데이터가 없어요"
        description="이 대학의 정시·수시 비율 데이터는 추후 업데이트될 예정이에요."
        className="py-8"
      />
    );
  }

  const susiPct = Math.round((avgSusi / total) * 100);
  const jeongsiPct = 100 - susiPct;

  // ── SVG 치수 ───────────────────────────────────────────────────────────
  const CX = 100;
  const CY = 100;
  const OR = 82; // outer radius
  const IR = 52; // inner radius
  const GAP = 2; // gap between segments (degrees)

  const hasBoth = susiPct > 0 && jeongsiPct > 0;
  const susiSweep = Math.max(0, (susiPct / 100) * 360 - (hasBoth ? GAP : 0));
  const jeongsiSweep = Math.max(0, (jeongsiPct / 100) * 360 - (hasBoth ? GAP : 0));
  const jeongsiStart = (susiPct / 100) * 360; // starts after full susi arc

  const susiD = susiPct > 0 ? donutPath(CX, CY, OR, IR, 0, susiSweep) : null;
  const jeongsiD =
    jeongsiPct > 0 ? donutPath(CX, CY, OR, IR, jeongsiStart, jeongsiSweep) : null;

  // ── 렌더 ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
      {/* ── 도넛 SVG ────────────────────────────────────────────────────── */}
      <div className="h-44 w-44 flex-shrink-0">
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          role="img"
          aria-label={`수시 ${susiPct}%, 정시 ${jeongsiPct}%`}
        >
          {/* 배경 트랙 */}
          <circle
            cx={CX}
            cy={CY}
            r={(OR + IR) / 2}
            strokeWidth={OR - IR}
            stroke="hsl(var(--muted))"
            fill="none"
            opacity={0.4}
          />

          {/* 수시 세그먼트 — primary(인디고) */}
          {susiD && (
            <path
              d={susiD}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
          )}

          {/* 정시 세그먼트 — accent(코랄) */}
          {jeongsiD && (
            <path
              d={jeongsiD}
              fill="hsl(var(--accent))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
          )}

          {/* 중심 텍스트 */}
          <text
            x={CX}
            y={CY - 10}
            textAnchor="middle"
            dominantBaseline="auto"
            style={{
              fill: "hsl(var(--foreground))",
              fontSize: 30,
              fontWeight: 700,
              fontFamily: "inherit",
            }}
          >
            {susiPct}%
          </text>
          <text
            x={CX}
            y={CY + 16}
            textAnchor="middle"
            dominantBaseline="auto"
            style={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            수시
          </text>
        </svg>
      </div>

      {/* ── 범례 + 수치 ─────────────────────────────────────────────────── */}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[180px]">
        {/* 수시 */}
        <div className="flex items-center gap-3">
          <span
            className="h-3.5 w-3.5 flex-shrink-0 rounded-full"
            style={{ background: "hsl(var(--primary))" }}
            aria-hidden="true"
          />
          <div className="flex flex-1 items-baseline justify-between gap-4">
            <span className="text-sm font-medium leading-none">
              수시 <span className="text-xs text-muted-foreground">(학생부·논술)</span>
            </span>
            <span
              className="text-xl font-bold tabular-nums"
              style={{ color: "hsl(var(--primary))" }}
            >
              {susiPct}%
            </span>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* 정시 */}
        <div className="flex items-center gap-3">
          <span
            className="h-3.5 w-3.5 flex-shrink-0 rounded-full"
            style={{ background: "hsl(var(--accent))" }}
            aria-hidden="true"
          />
          <div className="flex flex-1 items-baseline justify-between gap-4">
            <span className="text-sm font-medium leading-none">
              정시 <span className="text-xs text-muted-foreground">(수능)</span>
            </span>
            <span
              className="text-xl font-bold tabular-nums"
              style={{ color: "hsl(var(--accent))" }}
            >
              {jeongsiPct}%
            </span>
          </div>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          개설 학과 {n}개 평균 기준이에요.
          <br />
          실제 비율은 대학 모집 요강을 확인하세요.
        </p>
      </div>
    </div>
  );
}
