/**
 * lib/interests/extractor.ts
 *
 * 챗봇 메시지에서 관심사 키워드를 추출합니다.
 * 클라이언트 전용 (localStorage 기반). SSR 불필요.
 *
 * 추출 전략:
 *  1. 학과명 정확 매칭 (MAJOR_KEYWORDS)
 *     → 한국어 조사 1~3자 제거 후 재시도 (e.g. "신소재공학과에" → "신소재공학과")
 *  2. majors.json keywords 역방향 맵 (MAJOR_KW_MAP)
 *     → 개념 키워드("프로그래밍", "AI" 등)를 학과 단위로 그룹핑
 *     → 역시 조사 제거 후 재시도 (e.g. "프로그래밍을" → "프로그래밍")
 *  3. 직업명 정확 매칭 (JOB_KEYWORDS)
 *  4. 분야 키워드 (FIELD_KEYWORDS, 학과 미매핑 경우만)
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
 *
 * 핵심: 한국어 조사/어미 대응
 *   각 n-gram에 대해 끝에서 1~3자를 제거한 버전도 함께 생성합니다.
 *   예) "신소재공학과에"  → "신소재공학과에", "신소재공학과", "신소재공학"...
 *       "프로그래밍을"   → "프로그래밍을",  "프로그래밍"
 *       "컴퓨터공학과에서" → "컴퓨터공학과에서", "컴퓨터공학과에", "컴퓨터공학과" ← 매칭!
 */
function* candidates(text: string): Generator<string> {
  // 전체 텍스트 (연속 문자열 매칭)
  const stripped = text.replace(/[\s\n\r\t]+/g, "");
  yield stripped;

  // 공백/구두점으로 토큰 분리
  const tokens = text
    .split(/[\s,。、!?！？.·\-·/\\()（）\[\]「」『』"']+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  for (let len = 4; len >= 1; len--) {
    for (let i = 0; i <= tokens.length - len; i++) {
      const joined = tokens.slice(i, i + len).join("");

      // 원본 n-gram
      yield joined;

      // 끝 1~3자 제거 버전 (한국어 조사/어미 대응)
      for (let trim = 1; trim <= 3; trim++) {
        const shorter = joined.slice(0, -trim);
        if (shorter.length >= 2) yield shorter;
      }
    }
  }
}

// ── 오매칭 방지 블랙리스트 ────────────────────────────────────────────────
/**
 * 동사·일반어와 혼동되어 오매칭이 발생하는 단어를 차단합니다.
 * "배우" → 동사 '배우다'의 어간으로 쓰일 때 연극영화학과로 오매핑되는 경우 방지.
 */
const KEYWORD_BLACKLIST = new Set(["배우"]);

// ── 메인 추출 함수 ────────────────────────────────────────────────────────
/**
 * 단일 메시지 텍스트에서 DetectedInterest[] 를 추출합니다.
 */
export function extractKeywords(text: string): DetectedInterest[] {
  const now = new Date().toISOString();

  const byMajorId = new Map<string, DetectedInterest>(); // majorId → entry
  const byKeyword = new Map<string, DetectedInterest>();  // keyword → entry

  const mNameMap = getMajorNameMap();
  const jMap = getJobMap();
  const fSet = getFieldSet();
  const kwMap = getKwMapNorm();

  const processedKeys = new Set<string>(); // 같은 정규화 키 중복 방지

  for (const candidate of candidates(text)) {
    const key = norm(candidate);
    if (key.length < 2) continue;
    if (processedKeys.has(key)) continue;
    if (KEYWORD_BLACKLIST.has(key)) continue; // 오매칭 블랙리스트

    // ── 1. 학과명 정확 매칭 ──────────────────────────────────────────
    const majorInfo = mNameMap.get(key);
    if (majorInfo) {
      processedKeys.add(key);
      console.log(`[관심사] 학과명 감지: "${candidate}" → ${majorInfo.name} (${majorInfo.id})`);
      if (!byMajorId.has(majorInfo.id)) {
        byMajorId.set(majorInfo.id, {
          keyword: majorInfo.name,
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
      processedKeys.add(key);
      console.log(`[관심사] 개념 키워드 감지: "${candidate}" → ${linkedMajors.map((m) => m.name).join(", ")}`);
      for (const maj of linkedMajors) {
        if (!byMajorId.has(maj.id)) {
          byMajorId.set(maj.id, {
            keyword: maj.name,
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
      processedKeys.add(key);
      console.log(`[관심사] 직업명 감지: "${candidate}" (id=${jobId})`);
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
      processedKeys.add(key);
      console.log(`[관심사] 분야 키워드 감지: "${candidate}"`);
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

  const result = [...byMajorId.values(), ...byKeyword.values()];
  if (result.length === 0) {
    console.log(`[관심사] 감지된 키워드 없음 (입력: "${text.slice(0, 50)}")`);
  }
  return result;
}
