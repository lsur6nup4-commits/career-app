/**
 * lib/interests/extractor.ts
 *
 * 챗봇 메시지에서 관심사 키워드를 추출합니다.
 * 클라이언트 전용 (localStorage 기반). SSR 불필요.
 *
 * 추출 전략:
 *  1. 학과명 정확 매칭 (MAJOR_KEYWORDS) → category: "major", majorId 포함
 *  2. majors.json keywords 역방향 맵 (MAJOR_KW_MAP)
 *       → 개념 키워드("프로그래밍","AI" 등)를 학과 단위로 그룹핑
 *       → category: "major", keyword=학과명, matchedKeywords=[감지된 원본 키워드]
 *  3. 직업명 정확 매칭 (JOB_KEYWORDS) → category: "job"
 *  4. 분야 키워드 (FIELD_KEYWORDS) → category: "field" (학과 미매핑 경우만)
 */

import type { DetectedInterest } from "@/types/interests";
import {
  MAJOR_KEYWORDS,
  JOB_KEYWORDS,
  FIELD_KEYWORDS,
} from "./keywords-data";
import { MAJOR_KW_MAP } from "./major-kw-map";

// ── 정규화 ──────────────────────────────────────────────────────────────
function norm(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

// ── 지연 초기화된 역방향 맵 ─────────────────────────────────────────────
let majorNameMap: Map<string, { id: string; name: string; category: string }> | null = null;
let jobMap: Map<string, string> | null = null;
let fieldSet: Set<string> | null = null;
// MAJOR_KW_MAP 정규화 버전 (lowercase key)
let kwMapNorm: Map<string, { id: string; name: string; category: string }[]> | null = null;

function getMajorNameMap() {
  if (!majorNameMap) {
    majorNameMap = new Map(
      MAJOR_KEYWORDS.map((m) => [
        norm(m.keyword),
        { id: m.id, name: m.keyword, category: m.category },
      ]),
    );
  }
  return majorNameMap;
}

function getJobMap() {
  if (!jobMap) {
    jobMap = new Map(JOB_KEYWORDS.map((j) => [norm(j.keyword), j.id]));
  }
  return jobMap;
}

function getFieldSet() {
  if (!fieldSet) {
    fieldSet = new Set(FIELD_KEYWORDS.map(norm));
  }
  return fieldSet;
}

function getKwMapNorm() {
  if (!kwMapNorm) {
    kwMapNorm = new Map(
      Object.entries(MAJOR_KW_MAP).map(([kw, majors]) => [norm(kw), majors]),
    );
  }
  return kwMapNorm;
}

// ── 텍스트 전처리 ─────────────────────────────────────────────────────────
/**
 * 메시지에서 후보 n-gram 슬라이딩 윈도우를 생성합니다.
 * 공백/구두점으로 분리 후 1~4 토큰 조합.
 */
function* candidates(text: string): Generator<string> {
  // 전체 텍스트 (연속 문자열 매칭)
  const stripped = text.replace(/[\s\n\r\t]+/g, "");
  yield stripped;

  // 토큰 분리
  const tokens = text
    .split(/[\s,。、!?！？.·\-·/\\()（）\[\]「」『』"']+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  for (let len = 4; len >= 1; len--) {
    for (let i = 0; i <= tokens.length - len; i++) {
      yield tokens.slice(i, i + len).join("");
    }
  }
}

// ── 메인 추출 함수 ────────────────────────────────────────────────────────
/**
 * 단일 메시지 텍스트에서 DetectedInterest[] 를 추출합니다.
 *
 * 학과 단위 그룹핑:
 *  - majors.json keywords에 해당하는 개념어("프로그래밍","AI" 등) 감지 시
 *    해당 학과 단위 Interest(keyword=학과명, majorId=...)로 변환
 *  - 동일 학과에 대한 여러 키워드 → 1개 Interest에 matchedKeywords 배열로 누적
 *
 * 한 메시지에서 같은 majorId/keyword는 1회만 카운트합니다.
 */
export function extractKeywords(text: string): DetectedInterest[] {
  const now = new Date().toISOString();

  // 결과 맵: majorId 또는 keyword → DetectedInterest
  const byMajorId = new Map<string, DetectedInterest>(); // majorId → entry
  const byKeyword = new Map<string, DetectedInterest>();  // keyword(non-major) → entry

  const mNameMap = getMajorNameMap();
  const jMap = getJobMap();
  const fSet = getFieldSet();
  const kwMap = getKwMapNorm();

  // 이미 처리한 원본 키워드(중복 방지)
  const processedRawKws = new Set<string>();

  for (const candidate of candidates(text)) {
    const key = norm(candidate);
    if (key.length < 2) continue;
    if (processedRawKws.has(key)) continue;

    // ── 1. 학과명 정확 매칭 ──────────────────────────────────────────
    const majorInfo = mNameMap.get(key);
    if (majorInfo) {
      processedRawKws.add(key);
      if (!byMajorId.has(majorInfo.id)) {
        byMajorId.set(majorInfo.id, {
          keyword: majorInfo.name,   // 학과 이름 (e.g. "컴퓨터공학과")
          count: 0,
          category: "major",
          majorId: majorInfo.id,
          majorCategory: majorInfo.category,
          matchedKeywords: [candidate],
          addedAt: now,
        });
      } else {
        const e = byMajorId.get(majorInfo.id)!;
        if (!e.matchedKeywords?.includes(candidate)) {
          e.matchedKeywords = [...(e.matchedKeywords ?? []), candidate];
        }
      }
      continue;
    }

    // ── 2. majors.json keywords 역방향 맵 (개념어 → 학과 그룹핑) ─────
    const linkedMajors = kwMap.get(key);
    if (linkedMajors && linkedMajors.length > 0) {
      processedRawKws.add(key);
      for (const maj of linkedMajors) {
        if (!byMajorId.has(maj.id)) {
          byMajorId.set(maj.id, {
            keyword: maj.name,       // 학과 이름
            count: 0,
            category: "major",
            majorId: maj.id,
            majorCategory: maj.category,
            matchedKeywords: [candidate],
            addedAt: now,
          });
        } else {
          const e = byMajorId.get(maj.id)!;
          if (!e.matchedKeywords?.includes(candidate)) {
            e.matchedKeywords = [...(e.matchedKeywords ?? []), candidate];
          }
        }
      }
      continue;
    }

    // ── 3. 직업명 정확 매칭 ──────────────────────────────────────────
    const jobId = jMap.get(key);
    if (jobId) {
      processedRawKws.add(key);
      if (!byKeyword.has(key)) {
        byKeyword.set(key, {
          keyword: candidate,
          count: 0,
          category: "job",
          jobId,
          addedAt: now,
        });
      }
      continue;
    }

    // ── 4. 분야 키워드 (학과 미매핑 경우만) ──────────────────────────
    if (fSet.has(key)) {
      processedRawKws.add(key);
      if (!byKeyword.has(key)) {
        byKeyword.set(key, {
          keyword: candidate,
          count: 0,
          category: "field",
          addedAt: now,
        });
      }
    }
  }

  return [...byMajorId.values(), ...byKeyword.values()];
}
