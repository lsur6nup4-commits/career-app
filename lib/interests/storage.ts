import type { InterestProfile, DetectedInterest } from "@/types/interests";
import { INTEREST_STORAGE_KEY, CONFIRM_THRESHOLD } from "@/types/interests";

function genUserId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

// ── 기본 프로필 ────────────────────────────────────────────────────────────
function emptyProfile(): InterestProfile {
  return {
    userId: genUserId(),
    detectedInterests: [],
    lastUpdate: new Date().toISOString(),
  };
}

// ── 로드 ──────────────────────────────────────────────────────────────────
export function loadProfile(): InterestProfile {
  if (typeof window === "undefined") return emptyProfile();
  try {
    const raw = localStorage.getItem(INTEREST_STORAGE_KEY);
    if (!raw) return emptyProfile();
    return JSON.parse(raw) as InterestProfile;
  } catch {
    return emptyProfile();
  }
}

// ── 저장 ──────────────────────────────────────────────────────────────────
export function saveProfile(profile: InterestProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    INTEREST_STORAGE_KEY,
    JSON.stringify({ ...profile, lastUpdate: new Date().toISOString() }),
  );
}

// ── 키워드 카운트 증가 + 자동 등록 ───────────────────────────────────────
/**
 * 키워드 하나를 프로필에 기록합니다.
 *
 * 학과 단위 그룹핑(category==="major" && majorId 존재):
 *   - 동일 majorId의 기존 항목이 있으면 count+1, matchedKeywords 병합
 *   - 없으면 신규 추가
 * 그 외(job, field, concept):
 *   - 동일 keyword의 기존 항목이 있으면 count+1
 */
export function trackKeyword(
  profile: InterestProfile,
  keyword: DetectedInterest,
): InterestProfile {
  const now = new Date().toISOString();

  // 매칭 키: 학과 단위는 majorId 기준, 나머지는 keyword 문자열 기준
  const isMajorGrouped = keyword.category === "major" && !!keyword.majorId;

  const existing = isMajorGrouped
    ? profile.detectedInterests.find(
        (d) => d.category === "major" && d.majorId === keyword.majorId,
      )
    : profile.detectedInterests.find((d) => d.keyword === keyword.keyword);

  let updated: DetectedInterest[];

  if (existing) {
    updated = profile.detectedInterests.map((d) => {
      const isTarget = isMajorGrouped
        ? d.category === "major" && d.majorId === keyword.majorId
        : d.keyword === keyword.keyword;
      if (!isTarget) return d;

      const newCount = d.count + 1;

      // matchedKeywords 병합 (중복 제거)
      const incoming = keyword.matchedKeywords ?? [];
      const prev = d.matchedKeywords ?? [];
      const merged = Array.from(new Set([...prev, ...incoming]));

      const justConfirmed = newCount >= CONFIRM_THRESHOLD && !d.confirmedAt;
      if (justConfirmed) {
        console.log(`[관심사] ✅ 확정! "${d.keyword}" (count=${newCount}, 임계값=${CONFIRM_THRESHOLD})`);
      } else {
        console.log(`[관심사] 누적: "${d.keyword}" count ${d.count} → ${newCount}`);
      }

      return {
        ...d,
        count: newCount,
        matchedKeywords: merged.length > 0 ? merged : undefined,
        confirmedAt: justConfirmed ? now : d.confirmedAt,
      };
    });
  } else {
    const newEntry: DetectedInterest = {
      ...keyword,
      count: 1,
      addedAt: now,
      confirmedAt: 1 >= CONFIRM_THRESHOLD ? now : undefined,
    };
    console.log(`[관심사] 신규 등록: "${newEntry.keyword}" (majorId=${newEntry.majorId ?? "없음"})`);
    updated = [...profile.detectedInterests, newEntry];
  }

  return { ...profile, detectedInterests: updated, lastUpdate: now };
}

// ── 관심사 직접 추가 ──────────────────────────────────────────────────────
export function addInterestManually(
  profile: InterestProfile,
  keyword: Omit<DetectedInterest, "count" | "addedAt" | "confirmedAt">,
): InterestProfile {
  if (profile.detectedInterests.some((d) => d.keyword === keyword.keyword))
    return profile;
  const now = new Date().toISOString();
  const entry: DetectedInterest = {
    ...keyword,
    count: CONFIRM_THRESHOLD, // 수동 추가는 바로 확정
    addedAt: now,
    confirmedAt: now,
  };
  return {
    ...profile,
    detectedInterests: [...profile.detectedInterests, entry],
    lastUpdate: now,
  };
}

// ── 관심사 제거 ───────────────────────────────────────────────────────────
export function removeInterest(
  profile: InterestProfile,
  keyword: string,
): InterestProfile {
  return {
    ...profile,
    detectedInterests: profile.detectedInterests.filter(
      (d) => d.keyword !== keyword,
    ),
    lastUpdate: new Date().toISOString(),
  };
}

// ── 확정된(count >= 3) 관심사만 반환 ─────────────────────────────────────
export function getConfirmedInterests(
  profile: InterestProfile,
): DetectedInterest[] {
  return profile.detectedInterests
    .filter((d) => d.count >= CONFIRM_THRESHOLD)
    .sort((a, b) => b.count - a.count);
}

// ── 전체 초기화 ───────────────────────────────────────────────────────────
export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(INTEREST_STORAGE_KEY);
}
