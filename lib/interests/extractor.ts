/**
 * lib/interests/extractor.ts
 *
 * 챗봇 메시지에서 관심사 키워드를 추출합니다.
 * 클라이언트 전용 (localStorage 기반). SSR 불필요.
 *
 * 추출 전략:
 *  1. 학과명 정확 매칭 (MAJOR_KEYWORDS)
 *  2. 학과 개념 키워드 매칭 (MAJOR_CONCEPT_KEYWORDS)
 *  3. 직업명 정확 매칭 (JOB_KEYWORDS)
 *  4. 분야 키워드 매칭 (FIELD_KEYWORDS)
 */

import type { DetectedInterest } from "@/types/interests";
import {
  MAJOR_KEYWORDS,
  MAJOR_CONCEPT_KEYWORDS,
  JOB_KEYWORDS,
  FIELD_KEYWORDS,
} from "./keywords-data";

// ── 정규화 ──────────────────────────────────────────────────────────────
function norm(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

// ── 지연 초기화된 역방향 맵 ─────────────────────────────────────────────
let majorMap: Map<string, { id: string; category: string }> | null = null;
let jobMap: Map<string, string> | null = null;
let conceptSet: Set<string> | null = null;
let fieldSet: Set<string> | null = null;

function getMajorMap() {
  if (!majorMap) {
    majorMap = new Map(
      MAJOR_KEYWORDS.map((m) => [norm(m.keyword), { id: m.id, category: m.category }]),
    );
  }
  return majorMap;
}

function getJobMap() {
  if (!jobMap) {
    jobMap = new Map(JOB_KEYWORDS.map((j) => [norm(j.keyword), j.id]));
  }
  return jobMap;
}

function getConceptSet() {
  if (!conceptSet) {
    conceptSet = new Set(MAJOR_CONCEPT_KEYWORDS.map(norm));
  }
  return conceptSet;
}

function getFieldSet() {
  if (!fieldSet) {
    fieldSet = new Set(FIELD_KEYWORDS.map(norm));
  }
  return fieldSet;
}

// ── 텍스트 전처리 ─────────────────────────────────────────────────────────
/**
 * 메시지에서 후보 n-gram 슬라이딩 윈도우를 생성합니다.
 * 공백/구두점으로 분리 후 1~4 토큰 조합.
 */
function* candidates(text: string): Generator<string> {
  // 전체 텍스트 (연속 문자열 매칭)
  const stripped = text.replace(/[\s\n\r\t]+/g, "");
  yield stripped; // 긴 phrase 먼저

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
 * 한 메시지에서 같은 키워드는 1회만 카운트합니다.
 */
export function extractKeywords(text: string): DetectedInterest[] {
  const now = new Date().toISOString();
  const found = new Map<string, DetectedInterest>();

  const mMap = getMajorMap();
  const jMap = getJobMap();
  const cSet = getConceptSet();
  const fSet = getFieldSet();

  for (const candidate of candidates(text)) {
    const key = norm(candidate);
    if (key.length < 2) continue;
    if (found.has(key)) continue;

    // 1. 학과명 매칭
    const majorInfo = mMap.get(key);
    if (majorInfo) {
      found.set(key, {
        keyword: candidate,
        count: 0,
        category: "major",
        majorId: majorInfo.id,
        majorCategory: majorInfo.category,
        addedAt: now,
      });
      continue;
    }

    // 2. 직업명 매칭
    const jobId = jMap.get(key);
    if (jobId) {
      found.set(key, {
        keyword: candidate,
        count: 0,
        category: "job",
        jobId,
        addedAt: now,
      });
      continue;
    }

    // 3. 학과 개념 키워드
    if (cSet.has(key)) {
      found.set(key, {
        keyword: candidate,
        count: 0,
        category: "concept",
        addedAt: now,
      });
      continue;
    }

    // 4. 분야 키워드
    if (fSet.has(key)) {
      found.set(key, {
        keyword: candidate,
        count: 0,
        category: "field",
        addedAt: now,
      });
    }
  }

  return [...found.values()];
}
