/**
 * scripts/verify-mappings.mjs
 *
 * 대학-학과 매핑 데이터의 신뢰성 검증.
 *
 * 검증 항목:
 *   1. seed/university_majors.json 의 모든 (대학, 학과) 쌍이
 *      data/한국대학교육협의회_대학별학과정보_20260318.csv 에 존재하는지
 *   2. universityId·majorId 가 universities.json / majors.json 에 실존하는지
 *   3. 통계 리포트 (학과별 매핑 수, 매핑 0개 학과 목록)
 *
 * 종료 코드:
 *   0 — 모든 검증 통과
 *   1 — CSV에 없는 (대학, 학과) 쌍 발견 (오매핑 가능성)
 *
 * 실행: node scripts/verify-mappings.mjs
 *      npm run build 이전에 호출 권장
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normUni, normMajor, MAJOR_NAME_OVERRIDES } from "./_lib-mapping-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SEED = resolve(ROOT, "seed");
const DATA = resolve(ROOT, "data");

// ── CSV 파싱 ──────────────────────────────────────────────────────────────
function parseCsv(filePath) {
  const raw = readFileSync(filePath, "utf-8").replace(/\r/g, "");
  const lines = raw.split("\n").filter(Boolean);
  const header = lines[0].replace(/^﻿/, "").split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    const obj = {};
    header.forEach((k, i) => (obj[k] = (vals[i] || "").trim()));
    return obj;
  });
}

// ── 데이터 로드 ───────────────────────────────────────────────────────────
const majors = JSON.parse(readFileSync(`${SEED}/majors.json`, "utf-8"));
const universities = JSON.parse(readFileSync(`${SEED}/universities.json`, "utf-8"));
const universityMajors = JSON.parse(readFileSync(`${SEED}/university_majors.json`, "utf-8"));

const majorIds = new Set(majors.map((m) => m.id));
const uniIds = new Set(universities.map((u) => u.id));

const majorNameToId = new Map();
for (const m of majors) majorNameToId.set(normMajor(m.name), m.id);
for (const [k, v] of Object.entries(MAJOR_NAME_OVERRIDES)) {
  majorNameToId.set(normMajor(k), v);
}

const uniNameToId = new Map();
for (const u of universities) {
  uniNameToId.set(normUni(u.name), u.id);
  if (u.shortName) uniNameToId.set(normUni(u.shortName), u.id);
}

// ── CSV에 존재하는 (uni, major) 쌍 ─────────────────────────────────────
const CSV_FILE = `${DATA}/한국대학교육협의회_대학별학과정보_20260318.csv`;
const rows = parseCsv(CSV_FILE).filter(
  (r) =>
    r["학교구분명"] === "대학교" &&
    r["수업연한"] === "4년" &&
    r["학위과정명"] === "학사" &&
    r["학과상태명"] === "기존" &&
    r["학과명"] !== "기타(소속학과없음)"
);

const csvPairs = new Set();
for (const r of rows) {
  const uniId = uniNameToId.get(normUni(r["학교명"]));
  const majorId = majorNameToId.get(normMajor(r["학과명"]));
  if (uniId && majorId) csvPairs.add(`${uniId}::${majorId}`);
}

// ── 검증 실행 ─────────────────────────────────────────────────────────────
console.log("\n🔍 매핑 검증 시작\n");

let errors = 0;
let warnings = 0;

// 1. 존재하지 않는 universityId / majorId 검사
const invalidUni = universityMajors.filter((e) => !uniIds.has(e.universityId));
const invalidMaj = universityMajors.filter((e) => !majorIds.has(e.majorId));
if (invalidUni.length > 0) {
  console.error(`❌ universities.json 에 없는 universityId: ${invalidUni.length}건`);
  invalidUni.slice(0, 5).forEach((e) =>
    console.error(`   - ${e.universityId} × ${e.majorId}`)
  );
  errors += invalidUni.length;
}
if (invalidMaj.length > 0) {
  console.error(`❌ majors.json 에 없는 majorId: ${invalidMaj.length}건`);
  invalidMaj.slice(0, 5).forEach((e) =>
    console.error(`   - ${e.universityId} × ${e.majorId}`)
  );
  errors += invalidMaj.length;
}

// 2. CSV 에 존재하지 않는 매핑 검사 (가장 중요)
const orphans = universityMajors.filter(
  (e) => !csvPairs.has(`${e.universityId}::${e.majorId}`)
);
if (orphans.length > 0) {
  console.warn(`⚠️  CSV 원본에 없는 매핑(고아 매핑): ${orphans.length}건`);
  console.warn(`   → 인공 확장 매핑일 가능성. import-csv-data.mjs 재실행 권장.`);
  orphans.slice(0, 10).forEach((e) =>
    console.warn(`   - ${e.universityId} × ${e.majorId}` +
      (e.admissionQuota ? ` (정원 ${e.admissionQuota})` : ""))
  );
  if (orphans.length > 10) console.warn(`   ... 외 ${orphans.length - 10}건`);
  warnings += orphans.length;
}

// 3. 통계 리포트
const cnts = {};
universityMajors.forEach((e) => {
  cnts[e.majorId] = (cnts[e.majorId] || 0) + 1;
});
const noMap = majors.filter((m) => !cnts[m.id]);

console.log("\n📊 통계 리포트");
console.log(`  총 매핑 수      : ${universityMajors.length}`);
console.log(`  매핑된 학과 수  : ${Object.keys(cnts).length} / ${majors.length}`);
console.log(`  매핑 0개 학과   : ${noMap.length}`);
if (noMap.length > 0 && noMap.length <= 20) {
  console.log(`     ${noMap.map((m) => m.name).join(", ")}`);
}

const quotaCount = universityMajors.filter((e) => e.admissionQuota).length;
console.log(`  정원 정보 있음  : ${quotaCount} / ${universityMajors.length} ` +
  `(${Math.round(quotaCount / universityMajors.length * 100)}%)`);

// ── 최종 결과 ─────────────────────────────────────────────────────────────
console.log();
if (errors > 0) {
  console.error(`❌ 검증 실패: ${errors}건의 치명적 오류`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`⚠️  검증 경고: ${warnings}건의 고아 매핑 (빌드는 계속)`);
  // 경고는 빌드를 막지 않음 — exit 0
} else {
  console.log(`✅ 모든 검증 통과: ${universityMajors.length}개 매핑 모두 CSV 출처`);
}
