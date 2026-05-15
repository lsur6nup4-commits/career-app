/**
 * scripts/validate-all.mjs
 *
 * 앱 전체 데이터의 정합성을 자동 검증합니다.
 *
 * 검증 항목:
 *   [1] 대학-학과 매핑 무결성 (orphan ID, 매핑 0개 대학)
 *   [2] 학과-직업 매핑 (major_extras.careerPaths ↔ jobs.json)
 *   [3] AI 위험도 매핑 (jobs-ai-risk ↔ jobs.json)
 *   [4] 등록금 누락 대학 목록
 *   [5] 기본 데이터 완성도 (description, hollandTags, wage 등)
 *
 * 실행: node scripts/validate-all.mjs
 *   종료 코드 0 = 모든 검증 통과
 *   종료 코드 1 = 문제 발견
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normUni,
  normMajor,
  UNI_NAME_OVERRIDES,
  MAJOR_NAME_OVERRIDES,
} from "./_lib-mapping-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── 데이터 로드 ───────────────────────────────────────────────────────────
const majors = JSON.parse(readFileSync(`${ROOT}/seed/majors.json`, "utf-8"));
const universities = JSON.parse(
  readFileSync(`${ROOT}/seed/universities.json`, "utf-8"),
);
const universityMajors = JSON.parse(
  readFileSync(`${ROOT}/seed/university_majors.json`, "utf-8"),
);
const extrasRaw = JSON.parse(
  readFileSync(`${ROOT}/seed/major_extras.json`, "utf-8"),
);
const jobs = JSON.parse(readFileSync(`${ROOT}/seed/jobs.json`, "utf-8"));
const aiRisk = JSON.parse(
  readFileSync(`${ROOT}/data/jobs-ai-risk.json`, "utf-8"),
);

// ── 원본 CSV 파싱 (정상 미매핑 판별용) ────────────────────────────────────
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
const csvRows = parseCsv(
  `${ROOT}/data/한국대학교육협의회_대학별학과정보_20260318.csv`,
).filter(
  (r) =>
    r["학교구분명"] === "대학교" &&
    r["수업연한"] === "4년" &&
    r["학위과정명"] === "학사" &&
    r["학과상태명"] === "기존" &&
    r["학과명"] !== "기타(소속학과없음)",
);

// CSV → universityId 매핑 (UNI_NAME_OVERRIDES 우선, normUni 매핑)
const _uniNameToId = new Map();
const isMainCampus = (n) => !/[（(（][^）)）]*[）)）]/.test(n);
const _sortedUnis = [...universities].sort(
  (a, b) => Number(isMainCampus(b.name)) - Number(isMainCampus(a.name)),
);
for (const u of _sortedUnis) {
  const k = normUni(u.name);
  if (!_uniNameToId.has(k)) _uniNameToId.set(k, u.id);
  if (u.shortName) {
    const sk = normUni(u.shortName);
    if (!_uniNameToId.has(sk)) _uniNameToId.set(sk, u.id);
  }
}
// majorNameToId (import-csv-data와 동일한 규칙)
const _majorNameToId = new Map();
for (const m of majors) _majorNameToId.set(normMajor(m.name), m.id);
for (const [k, v] of Object.entries(MAJOR_NAME_OVERRIDES)) {
  _majorNameToId.set(normMajor(k), v);
}

// CSV 학교 커버리지 + 학과 매칭 가능성 통계
const csvCoveredUniIds = new Set();
const csvUniMajorStats = new Map(); // uniId → { csv, matched }
for (const r of csvRows) {
  const uniId =
    UNI_NAME_OVERRIDES[r["학교명"]] ?? _uniNameToId.get(normUni(r["학교명"]));
  if (!uniId) continue;
  csvCoveredUniIds.add(uniId);
  if (!csvUniMajorStats.has(uniId))
    csvUniMajorStats.set(uniId, { csv: 0, matched: 0 });
  const s = csvUniMajorStats.get(uniId);
  s.csv++;
  const majorId = _majorNameToId.get(normMajor(r["학과명"]));
  if (majorId) s.matched++;
}

const { _note: _ignored, ...extras } = extrasRaw;
void _ignored;

// ── 보조 함수 ─────────────────────────────────────────────────────────────
const uniIds = new Set(universities.map((u) => u.id));
const majorIds = new Set(majors.map((m) => m.id));
const jobNames = new Set(jobs.map((j) => j.job_nm));
const jobCds = new Set(jobs.map((j) => j.job_cd));
const aiCds = new Set(aiRisk.map((r) => r.job_cd));

let issueCount = 0;
const report = [];

function pass(num, label, detail = "") {
  report.push(`✅ [${num}] ${label}${detail ? " · " + detail : ""}`);
}
function fail(num, label, items, severity = "❌") {
  issueCount += items.length;
  const shown = items.slice(0, 15);
  const tail =
    items.length > 15 ? ` ... 외 ${items.length - 15}건` : "";
  report.push(
    `${severity} [${num}] ${label} (${items.length}건): ${shown.join(", ")}${tail}`,
  );
}
function warn(num, label, items) {
  fail(num, label, items, "⚠️ ");
}

console.log("🔍 앱 전체 데이터 검증 시작\n");

// ──────────────────────────────────────────────────────────────────────────
// [1] 대학-학과 매핑 무결성
// ──────────────────────────────────────────────────────────────────────────
const orphanUniIds = universityMajors
  .filter((e) => !uniIds.has(e.universityId))
  .map((e) => `${e.universityId}×${e.majorId}`);

const orphanMajorIds = universityMajors
  .filter((e) => !majorIds.has(e.majorId))
  .map((e) => `${e.universityId}×${e.majorId}`);

const mappedUniSet = new Set(universityMajors.map((e) => e.universityId));
const zeroMapUnis = universities.filter((u) => !mappedUniSet.has(u.id));

// 매핑 0개 대학을 3가지로 분류:
//   - ❌ 진짜 문제:  CSV에 데이터 있는데 매핑 누락 (수정 필요)
//   - ℹ️ 캠퍼스:    본교 매핑이 흡수 (CSV에 분교 별도 표기 없음 → 정상)
//   - ℹ️ 데이터부재: CSV 자체에 학교명 없음 (사관학교·교육대·대학원 등)
const SPECIAL_OK_PATTERN =
  /사관학교|폴리텍|사이버|대학원대학교|예술종합|체육대|승가|교육대학교|도립대학교|국제예술|문화관광|해기|중앙승가/;

// 본교가 매핑된 캠퍼스인지 판별 (예: 단국대 천안캠 → 본교 dankook은 매핑됨)
function hasMainCampusMapped(uniId, uniName) {
  // 분교 ID에 본교 prefix 추출 (단순 규칙)
  const mainIdGuess = uniId.split("-")[0].split("_")[0];
  return mappedUniSet.has(mainIdGuess);
}

const zeroMapUnexpected = [];
const zeroMapCampus = [];      // 본교 흡수된 분교
const zeroMapDataAbsent = [];  // CSV에 데이터 자체가 없음

for (const u of zeroMapUnis) {
  if (SPECIAL_OK_PATTERN.test(u.name)) {
    zeroMapDataAbsent.push(u);
    continue;
  }
  if (csvCoveredUniIds.has(u.id)) {
    // CSV에 학교 데이터 있음. 학과 매칭 가능성 확인.
    const stats = csvUniMajorStats.get(u.id);
    if (stats && stats.matched === 0) {
      // CSV 학과명이 모두 majors.json에 없는 학과 (예: "융합학부", "기초학부")
      // → 매핑 불가능한 케이스, 정상으로 분류
      zeroMapDataAbsent.push(u);
    } else {
      // CSV에 매핑 가능한 학과가 있는데 매핑 누락 → 진짜 문제
      zeroMapUnexpected.push(u);
    }
  } else if (hasMainCampusMapped(u.id, u.name) || !isMainCampus(u.name)) {
    // 본교가 매핑된 분교 → 정상 (CSV가 본교에 통합 기록)
    zeroMapCampus.push(u);
  } else {
    // CSV에 학교명 자체 없음
    zeroMapDataAbsent.push(u);
  }
}
const zeroMapExpected = zeroMapDataAbsent;

if (orphanUniIds.length === 0) {
  pass("1a", "universityId 무결성", `매핑 ${universityMajors.length}개 모두 정상`);
} else {
  fail("1a", "universities.json에 없는 universityId", orphanUniIds);
}

if (orphanMajorIds.length === 0) {
  pass("1b", "majorId 무결성", `매핑 ${universityMajors.length}개 모두 정상`);
} else {
  fail("1b", "majors.json에 없는 majorId", orphanMajorIds);
}

if (zeroMapUnexpected.length === 0) {
  pass(
    "1c",
    "매핑 0개 대학",
    `정상 (CSV 데이터 있는 일반 대학 매핑 누락 없음)`,
  );
} else {
  fail(
    "1c",
    "매핑 0개 (CSV에 데이터 있는데 미매핑)",
    zeroMapUnexpected.map((u) => u.name),
  );
}

if (zeroMapCampus.length > 0) {
  report.push(
    `ℹ️  [1d] 매핑 0개 분교 ${zeroMapCampus.length}개 — CSV가 본교에 통합 기록한 캠퍼스 (본교 매핑됨, 정상): ${zeroMapCampus.map((u) => u.name).slice(0, 5).join(", ")}${zeroMapCampus.length > 5 ? " 외" : ""}`,
  );
}

if (zeroMapDataAbsent.length > 0) {
  report.push(
    `ℹ️  [1e] 매핑 0개 특수/데이터부재 ${zeroMapDataAbsent.length}개 — CSV·공시 데이터 없는 학교 (사관학교·대학원·교대 등 정상 케이스)`,
  );
}

// ──────────────────────────────────────────────────────────────────────────
// [2] 학과-직업 매핑 (major_extras.careerPaths ↔ jobs.json)
// ──────────────────────────────────────────────────────────────────────────
const careerPathOrphans = [];
let careerPathTotal = 0;
let careerPathMatched = 0;

for (const [majorId, ext] of Object.entries(extras)) {
  if (!ext.careerPaths || !Array.isArray(ext.careerPaths)) continue;
  for (const careerName of ext.careerPaths) {
    careerPathTotal++;
    if (jobNames.has(careerName)) {
      careerPathMatched++;
    } else {
      careerPathOrphans.push(`${majorId}→"${careerName}"`);
    }
  }
}

// careerPaths는 워크넷 CSV의 자유 형식 직업명 텍스트.
// jobs.json의 표준 job_nm과 표기 차이가 많아 25% 이상이면 PASS.
const careerMatchRate =
  careerPathTotal > 0 ? Math.round((careerPathMatched / careerPathTotal) * 100) : 0;
if (careerPathTotal === 0) {
  pass("2", "학과-직업 매핑", "careerPaths 데이터 없음 (skip)");
} else if (careerMatchRate >= 25) {
  pass(
    "2",
    "학과-직업 매핑",
    `careerPaths ${careerPathMatched}/${careerPathTotal}건 jobs.json 매칭 (${careerMatchRate}%) — CSV 자유 텍스트라 100% 매칭 불가, 25%↑ 정상`,
  );
} else {
  warn("2", "학과-직업 매핑 매칭률 낮음", [
    `${careerPathMatched}/${careerPathTotal} (${careerMatchRate}%) 매칭`,
  ]);
}

// ──────────────────────────────────────────────────────────────────────────
// [3] AI 위험도 매핑 (jobs-ai-risk ↔ jobs.json)
// ──────────────────────────────────────────────────────────────────────────
const aiRiskOrphans = aiRisk
  .filter((r) => !jobCds.has(r.job_cd))
  .map((r) => `job_cd=${r.job_cd}`);

const jobsWithoutAi = jobs.filter((j) => !aiCds.has(j.job_cd)).map((j) => j.job_nm);

const aiDuplicates = (() => {
  const seen = new Set();
  const dups = [];
  for (const r of aiRisk) {
    if (seen.has(r.job_cd)) dups.push(`job_cd=${r.job_cd}`);
    seen.add(r.job_cd);
  }
  return dups;
})();

if (aiRiskOrphans.length === 0) {
  pass(
    "3a",
    "AI 위험도 → jobs 매칭",
    `${aiRisk.length}개 모두 정상`,
  );
} else {
  fail("3a", "jobs.json에 없는 job_cd", aiRiskOrphans);
}

if (jobsWithoutAi.length === 0) {
  pass("3b", "모든 직업에 AI 위험도", `${jobs.length}/${jobs.length} 매칭`);
} else {
  fail("3b", "AI 위험도 누락된 직업", jobsWithoutAi);
}

if (aiDuplicates.length === 0) {
  pass("3c", "AI 위험도 중복", "없음");
} else {
  fail("3c", "AI 위험도 중복 등록", aiDuplicates);
}

// ──────────────────────────────────────────────────────────────────────────
// [4] 등록금 누락 대학
// ──────────────────────────────────────────────────────────────────────────
// tuition_data.json에 학교가 있는지 확인해서 분류
// (없으면 대학알리미 미공시 → 정상 누락)
const tuitionData = JSON.parse(
  readFileSync(`${ROOT}/data/tuition_data.json`, "utf-8"),
);
const tuitionNorms = new Set();
for (const t of tuitionData) {
  tuitionNorms.add(normUni(t.name));
}

const TUITION_OK_PATTERN =
  /사관학교|폴리텍|사이버|대학원대학교|예술종합|체육대|교육대학교|도립대학교|국제예술|문화관광|해기|중앙승가|승가/;

const noTuition = universities.filter((u) => u.tuitionAvg === undefined);

// 분류:
// - 특수학교 패턴: ℹ️ 등록금 공시 대상 아님
// - tuition_data에도 없음: ℹ️ 대학알리미에 진짜 데이터 부재
// - tuition_data에는 있는데 매핑 실패: ❌ 매핑 누락 (수정 필요)
const noTuitionUnexpected = [];
const noTuitionExpected = [];
for (const u of noTuition) {
  if (TUITION_OK_PATTERN.test(u.name)) {
    noTuitionExpected.push(u);
  } else if (!tuitionNorms.has(normUni(u.name))) {
    // tuition_data 자체에 없음 → 정상 누락
    noTuitionExpected.push(u);
  } else {
    // tuition_data에 있는데 매핑 실패 → 진짜 문제
    noTuitionUnexpected.push(u);
  }
}

const withTuition = universities.length - noTuition.length;
const tuitionRate = Math.round((withTuition / universities.length) * 100);

if (noTuitionUnexpected.length === 0) {
  pass(
    "4",
    "등록금 매핑",
    `${withTuition}/${universities.length} (${tuitionRate}%) — 누락은 모두 데이터 부재 정상 케이스`,
  );
} else {
  fail(
    "4",
    "등록금 매핑 누락 (tuition_data에는 있는데 미매핑)",
    noTuitionUnexpected.map((u) => u.name),
  );
}

if (noTuitionExpected.length > 0) {
  report.push(
    `ℹ️  [4b] 등록금 데이터 부재 ${noTuitionExpected.length}개 — 대학알리미 미공시 학교 (사관학교·대학원·폴리텍·소규모 사립대 등)`,
  );
}

// ──────────────────────────────────────────────────────────────────────────
// [5] 기본 데이터 완성도
// ──────────────────────────────────────────────────────────────────────────
const shortDesc = majors.filter(
  (m) => !m.description || m.description.length < 50,
);
if (shortDesc.length === 0) {
  pass(
    "5a",
    "학과 description ≥50자",
    `${majors.length}/${majors.length} 정상`,
  );
} else {
  fail(
    "5a",
    "description 50자 미만 학과",
    shortDesc.map((m) => `${m.name}(${m.description?.length || 0}자)`),
  );
}

const noHolland = majors.filter(
  (m) => !m.hollandTags || m.hollandTags.length === 0,
);
if (noHolland.length === 0) {
  pass(
    "5b",
    "학과 hollandTags",
    `${majors.length}/${majors.length} 보유`,
  );
} else {
  fail("5b", "hollandTags 없는 학과", noHolland.map((m) => m.name));
}

const missingJobFields = jobs.filter(
  (j) => !j.wage || !j.wlb || !j.social,
);
if (missingJobFields.length === 0) {
  pass(
    "5c",
    "직업 wage/wlb/social",
    `${jobs.length}/${jobs.length} 모두 채워짐`,
  );
} else {
  fail(
    "5c",
    "wage/wlb/social 누락 직업",
    missingJobFields.map((j) => j.job_nm),
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 결과 출력
// ──────────────────────────────────────────────────────────────────────────
console.log(report.join("\n"));
console.log();
console.log("─".repeat(60));
console.log(`=== 총 ${issueCount}개 문제 발견 ===`);

process.exit(issueCount > 0 ? 1 : 0);
