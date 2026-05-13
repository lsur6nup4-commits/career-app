import aiRiskRaw from "@/data/jobs-ai-risk.json";

export type RiskLevel = "low" | "medium" | "high";

export type JobAiRisk = {
  job_cd: number;
  rate_2024: number;
  rate_2027: number;
  risk_2024: RiskLevel;
  risk_2027: RiskLevel;
  source: "actual" | "estimated";
};

const ALL: JobAiRisk[] = aiRiskRaw as JobAiRisk[];

const _map = new Map<number, JobAiRisk>(ALL.map((e) => [e.job_cd, e]));

export function getAiRisk(jobCd: number): JobAiRisk | null {
  return _map.get(jobCd) ?? null;
}

export function getAllAiRisk(): JobAiRisk[] {
  return ALL;
}

/** 위험도 표시 레이블·색상 */
export const RISK_META: Record<
  RiskLevel,
  { label: string; emoji: string; color: string; bg: string; border: string }
> = {
  low: {
    label: "저위험",
    emoji: "🟢",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  medium: {
    label: "중위험",
    emoji: "🟡",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-700",
  },
  high: {
    label: "고위험",
    emoji: "🔴",
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-700",
  },
};
