/**
 * scripts/import-csv-data.mjs
 *
 * 한국대학교육협의회_대학별학과정보_20260318.csv 파싱 후
 *   1. seed/university_majors.json  → 실제 입학정원 업데이트
 *   2. seed/major_extras.json       → 관련직업명 careerPaths 업데이트
 *   3. seed/universities.json       → 개설학과 기반 schoolRegion 등 보강
 *
 * 실행: node scripts/import-csv-data.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normUni,
  normMajor,
  MAJOR_NAME_OVERRIDES,
  UNI_NAME_OVERRIDES,
} from "./_lib-mapping-config.mjs";

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

// ── 이름 정규화 ───────────────────────────────────────────────────────────
// normUni, normMajor 는 scripts/_lib-mapping-config.mjs 에서 import

// ── 수동 매핑 (CSV 학과명 → seed major id) ────────────────────────────────
// ── 수동 매핑 사전: scripts/_lib-mapping-config.mjs 의 MAJOR_NAME_OVERRIDES 사용 ─

// ── seed 로드 ──────────────────────────────────────────────────────────────
const majors = JSON.parse(readFileSync(`${SEED}/majors.json`, "utf-8"));
const universities = JSON.parse(readFileSync(`${SEED}/universities.json`, "utf-8"));
const universityMajors = JSON.parse(readFileSync(`${SEED}/university_majors.json`, "utf-8"));
const extras = JSON.parse(readFileSync(`${SEED}/major_extras.json`, "utf-8"));

// ── 매핑 테이블 구성 ──────────────────────────────────────────────────────
/** CSV 정규화된 학과명 → seed major id */
const majorNameToId = new Map();
// 1. seed 학과명 직접 등록
for (const m of majors) {
  majorNameToId.set(normMajor(m.name), m.id);
}
// 2. 수동 오버라이드
for (const [csvName, id] of Object.entries(MAJOR_NAME_OVERRIDES)) {
  majorNameToId.set(normMajor(csvName), id);
}

/**
 * 정규화된 대학명 → seed university id
 *
 * 본교 우선 매핑: 분교(괄호 표기)와 본교의 normUni 결과가 같을 때
 * 본교 ID가 매핑되도록 정렬한 뒤 등록. CSV 학과명에는 캠퍼스 표기가
 * 없으므로, CSV의 "한양대학교"는 본교 hanyang 으로 매핑되어야 함.
 */
const uniNameToId = new Map();
const isMainCampus = (name) => !/[（(（][^）)）]*[）)）]/.test(name);
const sortedUnis = [...universities].sort((a, b) => {
  return Number(isMainCampus(b.name)) - Number(isMainCampus(a.name));
});
for (const u of sortedUnis) {
  const key = normUni(u.name);
  if (!uniNameToId.has(key)) uniNameToId.set(key, u.id);
  if (u.shortName) {
    const sk = normUni(u.shortName);
    if (!uniNameToId.has(sk)) uniNameToId.set(sk, u.id);
  }
}

// ── CSV 파싱 + 필터링 ─────────────────────────────────────────────────────
const CSV_FILE = `${DATA}/한국대학교육협의회_대학별학과정보_20260318.csv`;
const allRows = parseCsv(CSV_FILE);

const filtered = allRows.filter(
  (r) =>
    r["학교구분명"] === "대학교" &&
    r["수업연한"] === "4년" &&
    r["학위과정명"] === "학사" &&
    r["학과상태명"] === "기존" &&
    r["학과명"] !== "기타(소속학과없음)"
);

console.log(`\n📂 CSV 파싱 완료: 전체 ${allRows.length}행 → 필터링 후 ${filtered.length}행\n`);

// ── 1단계: university_majors 입학정원 집계 ────────────────────────────────
// CSV에서 (대학, 학과) 쌍 추출하고 입학정원 집계
const csvUniMajorMap = new Map(); // "uniId::majorId" → 정원
let matchedUni = 0, unmatchedUni = 0;
let matchedMaj = 0, unmatchedMaj = 0;
const unmatchedMajorNames = new Set();

for (const row of filtered) {
  // 1차: 직접 학교명 매핑 (캠퍼스 분교 + 별칭)
  // 2차: normUni 정규화 매핑
  const uniId =
    UNI_NAME_OVERRIDES[row["학교명"]] ?? uniNameToId.get(normUni(row["학교명"]));
  if (!uniId) { unmatchedUni++; continue; }
  matchedUni++;

  const majorId = majorNameToId.get(normMajor(row["학과명"]));
  if (!majorId) {
    unmatchedMajorNames.add(row["학과명"]);
    unmatchedMaj++;
    continue;
  }
  matchedMaj++;

  const quota = parseInt(row["입학정원수"], 10) || 0;
  const key = `${uniId}::${majorId}`;

  if (!csvUniMajorMap.has(key)) {
    csvUniMajorMap.set(key, { uniId, majorId, quota: 0 });
  }
  csvUniMajorMap.get(key).quota += quota;
}

console.log(`🏫 대학 매칭: ${matchedUni}행 성공 / ${unmatchedUni}행 미매칭`);
console.log(`📚 학과 매칭: ${matchedMaj}행 성공 / ${unmatchedMaj}행 미매칭`);
console.log(`   (미매칭 학과명 ${unmatchedMajorNames.size}종 — 수동 매핑 추가 가능)\n`);

// ─────────────────────────────────────────────────────────────────────────
// university_majors.json 완전 재생성 (CSV 매핑만 사용, 기존 데이터 완전 폐기)
// ─────────────────────────────────────────────────────────────────────────
const previousCount = universityMajors.length;
const newUniversityMajors = [];

for (const [, { uniId, majorId, quota }] of csvUniMajorMap) {
  // CSV 매핑은 quota=0이어도 매핑 자체는 유지 (학과가 개설된 것은 사실).
  // 단, quota=0이면 admissionQuota 필드를 생략(가짜 라벨 금지).
  const entry = { universityId: uniId, majorId };
  if (quota > 0) entry.admissionQuota = quota;
  newUniversityMajors.push(entry);
}

// 정렬: majorId → universityId 순
newUniversityMajors.sort((a, b) => {
  if (a.majorId !== b.majorId) return a.majorId.localeCompare(b.majorId);
  return a.universityId.localeCompare(b.universityId);
});

writeFileSync(
  `${SEED}/university_majors.json`,
  JSON.stringify(newUniversityMajors, null, 2) + "\n",
  "utf-8"
);
console.log(`✅ university_majors.json 재생성 완료`);
console.log(`   변경 전: ${previousCount}개 → 변경 후: ${newUniversityMajors.length}개`);
console.log(`   감소: ${previousCount - newUniversityMajors.length}개 (인공 확장 매핑 제거)\n`);

// 검증용: 새 배열로 교체
universityMajors.length = 0;
universityMajors.push(...newUniversityMajors);

// ── 2단계: 학과별 careerPaths 집계 ───────────────────────────────────────
// 관련직업명을 학과 ID별로 집계 (빈도수 기준)
const majorCareerMap = new Map(); // majorId → Map<직업명, count>

for (const row of filtered) {
  const majorId = majorNameToId.get(normMajor(row["학과명"]));
  if (!majorId) continue;
  const careers = row["관련직업명"];
  if (!careers || !careers.trim()) continue;

  if (!majorCareerMap.has(majorId)) majorCareerMap.set(majorId, new Map());
  const cntMap = majorCareerMap.get(majorId);

  for (const career of careers.split("+")) {
    const c = career.trim();
    if (c.length < 2) continue;
    cntMap.set(c, (cntMap.get(c) || 0) + 1);
  }
}

// major_extras.json 의 careerPaths 업데이트
let updatedCareer = 0;
for (const [majorId, cntMap] of majorCareerMap) {
  // 빈도 높은 순 정렬, 상위 7개
  const sorted = [...cntMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name]) => name);

  if (!extras[majorId]) extras[majorId] = {};
  extras[majorId].careerPaths = sorted;
  updatedCareer++;
}

writeFileSync(
  `${SEED}/major_extras.json`,
  JSON.stringify(extras, null, 2) + "\n",
  "utf-8"
);
console.log(`✅ major_extras.json: ${updatedCareer}개 학과에 careerPaths 추가/갱신\n`);

// ── 3단계: 학과 평균 입학정원 → majors.json 업데이트 ─────────────────────
// 학과 ID별 정원 집계 (여러 대학 평균)
const majorQuotaMap = new Map(); // majorId → { total, count }
for (const [, { majorId, quota }] of csvUniMajorMap) {
  if (quota === 0) continue;
  if (!majorQuotaMap.has(majorId)) majorQuotaMap.set(majorId, { total: 0, count: 0 });
  const s = majorQuotaMap.get(majorId);
  s.total += quota;
  s.count++;
}

// majors.json 에 averageAdmissionQuota 필드 추가
let updatedMajors = 0;
for (const m of majors) {
  const stat = majorQuotaMap.get(m.id);
  if (stat && stat.count > 0) {
    m.averageAdmissionQuota = Math.round(stat.total / stat.count);
    updatedMajors++;
  }
}

writeFileSync(
  `${SEED}/majors.json`,
  JSON.stringify(majors, null, 2) + "\n",
  "utf-8"
);
console.log(`✅ majors.json: ${updatedMajors}개 학과에 averageAdmissionQuota 추가\n`);

// ── 요약 ──────────────────────────────────────────────────────────────────
console.log("── 완료 요약 ─────────────────────────────────────────────────");
console.log(`  CSV 대상 행수   : ${filtered.length}`);
console.log(`  대학 매칭률     : ${matchedUni}/${filtered.length} (${Math.round(matchedUni/filtered.length*100)}%)`);
console.log(`  학과 매칭률     : ${matchedMaj}/${filtered.length} (${Math.round(matchedMaj/filtered.length*100)}%)`);
console.log(`  미매칭 학과종류 : ${unmatchedMajorNames.size}종`);

if (unmatchedMajorNames.size <= 30) {
  console.log("  미매칭 학과명:", [...unmatchedMajorNames].slice(0, 30).join(", "));
}
console.log("\n🎉 모든 파일 업데이트 완료!");
