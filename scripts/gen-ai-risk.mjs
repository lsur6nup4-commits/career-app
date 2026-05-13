/**
 * gen-ai-risk.mjs
 * seeds/jobs.json × data/ai_risk_data.json 매핑 → data/jobs-ai-risk.json
 *
 * 매칭 전략 (우선순위 순):
 *   1. 정규화 완전일치
 *   2. 소괄호 제거 후 일치
 *   3. 길이 ≥4 부분문자열 포함
 *   4. rel_job_nm 토큰으로 역탐색
 *   5. 미매칭 → top_nm 기반 추정 + job_cd 해시 변동
 *
 * 임계값 (원본 데이터 기준):
 *   low:    rate < 30
 *   medium: 30 ≤ rate < 70
 *   high:   rate ≥ 70
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const aiRaw = JSON.parse(readFileSync(path.join(root, "data/ai_risk_data.json"), "utf8"));
const jobs  = JSON.parse(readFileSync(path.join(root, "seed/jobs.json"), "utf8"));

// ── 정규화 ────────────────────────────────────────────────────────────────
/** 공백·특수문자 제거, 괄호 내용 유지 버전 */
function norm(s) {
  return s.replace(/\s+/g, "").replace(/[·\-\/]/g, "");
}
/** 괄호 내용까지 제거 */
function normStrip(s) {
  return s.replace(/[（(（][^）)）]*[）)）]/g, "").replace(/\s+/g, "").replace(/[·\-\/]/g, "");
}

// ── AI 위험도 임계값 ──────────────────────────────────────────────────────
function getRisk(rate) {
  if (rate < 30) return "low";
  if (rate < 70) return "medium";
  return "high";
}

// ── ai_risk 이름 → 엔트리 맵 ─────────────────────────────────────────────
const exactMap  = new Map(); // norm(name) → entry
const stripMap  = new Map(); // normStrip(name) → entry

for (const e of aiRaw) {
  exactMap.set(norm(e.name), e);
  stripMap.set(normStrip(e.name), e);
}

// ── 퍼지 검색 ─────────────────────────────────────────────────────────────
function fuzzyFind(jobNm) {
  const n  = norm(jobNm);
  const ns = normStrip(jobNm);

  // 1. 완전일치
  if (exactMap.has(n))  return exactMap.get(n);
  if (stripMap.has(ns)) return stripMap.get(ns);

  // 2. 길이 ≥4 인 경우 포함 관계 (양방향)
  const MIN = 4;
  if (n.length >= MIN) {
    for (const [key, entry] of exactMap) {
      if (key.length >= MIN && (n.includes(key) || key.includes(n))) return entry;
    }
  }
  // 3. strip 버전으로도 시도
  if (ns.length >= MIN) {
    for (const [key, entry] of stripMap) {
      if (key.length >= MIN && (ns.includes(key) || key.includes(ns))) return entry;
    }
  }
  return null;
}

// ── rel_job_nm 역탐색 ────────────────────────────────────────────────────
function relFind(relStr) {
  if (!relStr) return null;
  const tokens = relStr.split(/[,，]/).map(s => s.trim()).filter(s => s.length >= 3);
  for (const t of tokens) {
    const hit = fuzzyFind(t);
    if (hit) return hit;
  }
  return null;
}

// ── 카테고리 기반 추정 ────────────────────────────────────────────────────
const CAT_BASE = {
  "경영·사무·금융·보험직":                        [50, 68],
  "연구직 및 공학 기술직":                         [40, 58],
  "보건·의료직":                                   [36, 52],
  "설치·정비·생산직":                              [44, 62],
  "건설·채굴직":                                   [24, 36],
  "예술·디자인·방송·스포츠직":                    [26, 42],
  "영업·판매·운전·운송직":                         [42, 60],
  "농림어업직":                                    [20, 30],
  "미용·여행·숙박·음식·경비·청소직":              [30, 44],
  "교육·법률·사회복지·경찰·소방직 및 군인":       [32, 48],
};
const DEFAULT_BASE = [38, 55];

/** 직업명 키워드로 ±보정 */
function keywordDelta(nm) {
  let d24 = 0, d27 = 0;
  if (/사무|행정|관리|처리|입력|심사|발급|기록|검토|집계/.test(nm))  { d24 += 8;  d27 += 10; }
  if (/분석|데이터|통계|회계|세무|경리/.test(nm))                    { d24 += 6;  d27 += 10; }
  if (/치료|돌봄|상담|복지|간호|간병|요양/.test(nm))                  { d24 -= 10; d27 -= 8;  }
  if (/교육|교사|강사|코치|가르/.test(nm))                            { d24 -= 6;  d27 -= 4;  }
  if (/창작|예술|작가|디자인|연출|공연|촬영/.test(nm))                { d24 -= 8;  d27 -= 6;  }
  if (/연구|개발|설계|기획/.test(nm))                                 { d24 -= 3;  d27 -= 4;  }
  if (/운전|배달|택배|배송/.test(nm))                                  { d24 += 5;  d27 += 8;  }
  if (/청소|세탁|경비|보안/.test(nm))                                  { d24 -= 2;  d27 += 2;  }
  if (/조리|요리|음식|주방/.test(nm))                                  { d24 -= 4;  d27 -= 2;  }
  if (/스포츠|체육|심판|선수/.test(nm))                                { d24 -= 8;  d27 -= 6;  }
  return [d24, d27];
}

/** job_cd 해시로 ±5 범위 일관된 노이즈 */
function cdNoise(cd) {
  return ((cd * 7919) % 11) - 5;
}

function estimate(job) {
  const [b24, b27] = CAT_BASE[job.top_nm] ?? DEFAULT_BASE;
  const [d24, d27] = keywordDelta(job.job_nm);
  const noise = cdNoise(job.job_cd);
  const r24 = Math.min(69, Math.max(5, b24 + d24 + noise));
  const r27 = Math.min(92, Math.max(8, b27 + d27 + noise));
  return {
    rate_2024: parseFloat(r24.toFixed(1)),
    rate_2027: parseFloat(r27.toFixed(1)),
    risk_2024: getRisk(r24),
    risk_2027: getRisk(r27),
  };
}

// ── 매핑 실행 ─────────────────────────────────────────────────────────────
const result = [];
let cntActual = 0, cntEstimated = 0;

for (const job of jobs) {
  let hit = fuzzyFind(job.job_nm) ?? relFind(job.rel_job_nm);

  if (hit) {
    cntActual++;
    result.push({
      job_cd:   job.job_cd,
      rate_2024: hit.rate_2024,
      rate_2027: hit.rate_2027,
      risk_2024: hit.risk_2024,
      risk_2027: hit.risk_2027,
      source:   "actual",
    });
  } else {
    cntEstimated++;
    const est = estimate(job);
    result.push({ job_cd: job.job_cd, ...est, source: "estimated" });
  }
}

// ── 저장 ─────────────────────────────────────────────────────────────────
result.sort((a, b) => a.job_cd - b.job_cd);
writeFileSync(
  path.join(root, "data/jobs-ai-risk.json"),
  JSON.stringify(result, null, 2),
  "utf8",
);

console.log(`✅  저장 완료: data/jobs-ai-risk.json`);
console.log(`   실제 데이터  : ${cntActual} 개 (${((cntActual/jobs.length)*100).toFixed(1)}%)`);
console.log(`   추정 데이터  : ${cntEstimated} 개 (${((cntEstimated/jobs.length)*100).toFixed(1)}%)`);
console.log(`   총 직업 수   : ${result.length}`);

// 분포 확인
const dist24 = { low: 0, medium: 0, high: 0 };
const dist27 = { low: 0, medium: 0, high: 0 };
for (const r of result) { dist24[r.risk_2024]++; dist27[r.risk_2027]++; }
console.log(`\n   2024 분포: 저위험 ${dist24.low} / 중위험 ${dist24.medium} / 고위험 ${dist24.high}`);
console.log(`   2027 분포: 저위험 ${dist27.low} / 중위험 ${dist27.medium} / 고위험 ${dist27.high}`);
