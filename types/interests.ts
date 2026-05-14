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
  /**
   * 학과 단위 그룹핑 시 실제로 감지된 원본 키워드들
   * e.g. keyword="컴퓨터공학과", matchedKeywords=["프로그래밍","알고리즘","AI"]
   */
  matchedKeywords?: string[];
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

/** 관심사 자동 등록 임계값 (학과 단위 키워드 누적 기준) */
export const CONFIRM_THRESHOLD = 2;

/** localStorage 키 */
export const INTEREST_STORAGE_KEY = "interest_profile_v1";
