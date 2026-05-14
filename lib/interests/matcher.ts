import type { DetectedInterest } from "@/types/interests";
import type { Major } from "@/types/major";

/**
 * 학과 하나에 대해 사용자 관심사 키워드 중 일치하는 것들을 반환.
 *
 * 매칭 우선순위:
 *  1. interest.majorId === major.id (직접 매핑)
 *  2. major.keywords ↔ interest.keyword 포함 관계
 *  3. major.name 핵심어(학과/과/부 제거)가 interest.keyword에 포함되거나 역방향
 */
export function matchInterestsToMajor(
  major: Major,
  interests: DetectedInterest[],
): string[] {
  const seen = new Set<string>();
  const matched: string[] = [];

  for (const interest of interests) {
    if (seen.has(interest.keyword)) continue;

    // 1. majorId 직접 매핑
    if (interest.majorId && interest.majorId === major.id) {
      matched.push(interest.keyword);
      seen.add(interest.keyword);
      continue;
    }

    const kw = interest.keyword.toLowerCase().trim();
    if (kw.length < 2) continue;

    // 2. major.keywords와 포함 관계 확인
    const inKeywords = major.keywords.some((k) => {
      const mk = k.toLowerCase();
      return mk === kw || mk.includes(kw) || kw.includes(mk);
    });
    if (inKeywords) {
      matched.push(interest.keyword);
      seen.add(interest.keyword);
      continue;
    }

    // 3. major.name 핵심어(학과/과/부 제거) 매칭
    const majorBase = major.name
      .replace(/학과|전공학부|전공|학부|계열$/, "")
      .toLowerCase()
      .trim();
    if (
      majorBase.length >= 2 &&
      (kw.includes(majorBase) || majorBase.includes(kw))
    ) {
      matched.push(interest.keyword);
      seen.add(interest.keyword);
    }
  }

  return matched;
}

/** 모든 학과에 대해 관심사 매칭 점수 계산, score > 0인 것을 내림차순 정렬 */
export function rankMajorsByInterests(
  majors: Major[],
  interests: DetectedInterest[],
): Array<{ major: Major; matched: string[]; score: number }> {
  return majors
    .map((major) => {
      const matched = matchInterestsToMajor(major, interests);
      return { major, matched, score: matched.length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
