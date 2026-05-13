export type InterestCategory = "major" | "job" | "concept" | "field";

export type DetectedInterest = {
  keyword: string;
  /** 등장 횟수 */
  count: number;
  category: InterestCategory;
  /** category==="major" 일 때 학과 ID */
  majorId?: string;
  /** category==="major" 일 때 계열 */
  majorCategory?: string;
  /** category==="job" 일 때 직업 코드(문자열) */
  jobId?: string;
  /** 처음 감지된 시각 (ISO 8601) */
  addedAt: string;
  /** count >= CONFIRM_THRESHOLD 에 도달한 시각 */
  confirmedAt?: string;
};

export type InterestProfile = {
  /** 익명 ID (crypto.randomUUID or fallback) */
  userId: string;
  detectedInterests: DetectedInterest[];
  lastUpdate: string;
};

/** 관심사 자동 등록 임계값 */
export const CONFIRM_THRESHOLD = 3;

/** localStorage 키 */
export const INTEREST_STORAGE_KEY = "interest_profile_v1";
