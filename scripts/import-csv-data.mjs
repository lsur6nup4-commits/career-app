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
/** 대학명 정규화: 괄호+내용·국립/사립 접두사 제거, 공백 제거 */
function normUni(name) {
  return name
    .replace(/\s*\([^)]*\)/g, "")   // "(고령)" 등 괄호 제거
    .replace(/^국립|^사립|^공립/, "") // 국립/사립 접두사 제거
    .replace(/\s+/g, "")
    .trim();
}

/** 학과명 정규화: 학과/학부/과 suffix 제거, 공백 제거 */
function normMajor(name) {
  return name
    .replace(/\s+/g, "")
    .replace(/(학부|전공|전문학부)$/, "학과")
    .trim();
}

// ── 수동 매핑 (CSV 학과명 → seed major id) ────────────────────────────────
const MAJOR_NAME_OVERRIDES = {
  // 공학계열
  "전기공학과": "electrical-engineering",
  "전자공학과": "electrical-engineering",
  "전기전자공학부": "electrical-engineering",
  "반도체공학과": "electrical-engineering",
  "소프트웨어학과": "software",
  "AI학과": "ai-engineering",
  "인공지능공학과": "ai-engineering",
  "빅데이터학과": "data-science",
  "데이터과학과": "data-science",
  "정보보안학과": "cybersecurity",
  "정보보호학과": "cybersecurity",
  "게임공학부": "game-engineering",
  "항공우주공학부": "aerospace",
  "자동차학과": "automotive",
  "스마트자동차학과": "automotive",
  "로봇시스템공학과": "robotics",
  "지능로봇공학과": "robotics",
  "신소재공학부": "new-materials",
  "재료공학과": "new-materials",
  "섬유패션공학과": "textile",
  "환경에너지공학과": "environmental",
  "에너지자원공학과": "energy",
  "원자력및양자공학과": "nuclear",
  "도시계획학과": "urban-planning-eng",
  "도시및지역계획학과": "urban-planning-eng",
  "건설환경공학과": "civil-construction",
  "토목환경공학과": "civil-construction",
  "해양시스템공학과": "ocean-engineering",
  "자원에너지학과": "mining",
  "광산자원공학과": "mining",
  "나노소재공학과": "nano",
  "바이오공학과": "bio-engineering",
  "생물공학과": "bio-engineering",
  "융합기계공학과": "mechatronics",
  "메카트로닉스공학부": "mechatronics",
  "교통시스템공학과": "transportation",
  "농업생명과학과": "agricultural-engineering",
  "식품생명공학과": "food-engineering",
  "식품공학부": "food-engineering",
  "산업경영공학과": "industrial-engineering",
  "산업공학부": "industrial-engineering",
  "제어계측공학과": "mechatronics",
  "시스템반도체공학과": "electrical-engineering",
  "디스플레이공학과": "electrical-engineering",
  // 자연계열
  "생물학과": "biology",
  "생명과학부": "biology",
  "분자생물학과": "biology",
  "지구환경과학과": "earth-science",
  "지구시스템과학과": "earth-science",
  "지질환경과학과": "geology",
  "해양과학과": "oceanography",
  "천문학과": "astronomy",
  "대기과학부": "atmospheric",
  "산림자원학과": "forestry",
  "산림학과": "forestry",
  "원예생명과학과": "horticulture",
  "원예산업학과": "horticulture",
  "축산학과": "animal-science",
  "동물생산학과": "animal-science",
  "수산학과": "fisheries",
  "해양생명과학과": "fisheries",
  "응용통계학과": "statistics",
  "전산통계학과": "statistics",
  // 인문계열
  "동양사학부": "east-asian-history",
  "동양사학전공": "east-asian-history",
  "서양사학부": "western-history",
  "문화재보존학과": "cultural-heritage",
  "문화유산학과": "cultural-heritage",
  "인도어과": "indian-lit",
  "인도어학과": "indian-lit",
  "한국어문학과": "korean-language-lit",
  "국문학과": "korean-language-lit",
  "영문학과": "english-language-lit",
  "불문학과": "french-lit",
  "독문학과": "german-lit",
  "일문학과": "japanese-lit",
  "중문학과": "chinese-lit",
  "노어학과": "russian-lit",
  "서어학과": "spanish-lit",
  // 사회계열
  "북한학부": "north-korea-studies",
  "통일학과": "north-korea-studies",
  "국제학과": "global-studies",
  "국제지역학과": "global-studies",
  "글로벌비즈니스학과": "international-business",
  "국제무역학과": "trade",
  "청소년지도학과": "youth-studies",
  "아동복지학과": "child-studies",
  "가족자원경영학과": "family-studies",
  // 교육계열
  "국어교육학과": "korean-language-edu",
  "영어교육학과": "english-edu",
  "수학교육학과": "math-edu",
  "사회교육학과": "social-edu",
  "과학교육학과": "science-edu",
  "윤리교육학과": "ethics-edu",
  "역사교육학과": "history-edu",
  "특수교육학과": "special-edu",
  "유아교육학과": "early-childhood-edu",
  "미술교육학과": "art-edu",
  "음악교육학과": "music-edu",
  "기술교육학과": "technology-edu",
  "가정교육학과": "home-edu",
  // 의약계열
  "의학과": "medicine",
  "치의학과": "dentistry",
  "한의학과": "korean-medicine",
  "수의학과": "veterinary",
  "보건학부": "public-health",
  "보건관리학과": "public-health",
  "방사선과": "radiology",
  "방사선학부": "radiology",
  "임상병리과": "clinical-pathology",
  "물리치료과": "physical-therapy",
  "작업치료과": "occupational-therapy",
  "응급구조과": "emergency-medical",
  // 예체능계열
  "시각디자인과": "visual-design",
  "산업디자인과": "industrial-design",
  "패션디자인과": "fashion-design",
  "실내건축학과": "interior-design",
  "인테리어디자인학과": "interior-design",
  "한국화과": "painting-eastern",
  "회화과": "painting-western",
  "서양화과": "painting-western",
  "애니메이션학과": "animation",
  "게임그래픽학과": "game-graphics",
  "연기과": "theater-film",
  "피아노과": "piano",
  "성악과": "vocal",
  "관현악부": "orchestra",
  "국악과": "korean-music",
  "실용음악학과": "applied-music",
  "무용과": "dance",
  "발레과": "dance",
  "태권도과": "taekwondo",
  "생활체육학과": "social-sports",
  "스포츠의학과": "sports-science",
  "스포츠건강관리학과": "sports-science",
};

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

/** 정규화된 대학명 → seed university id */
const uniNameToId = new Map();
for (const u of universities) {
  uniNameToId.set(normUni(u.name), u.id);
  if (u.shortName) uniNameToId.set(normUni(u.shortName), u.id);
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
  const uniId = uniNameToId.get(normUni(row["학교명"]));
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

// university_majors.json 업데이트
// 기존 항목 인덱스 구성
const existingUMIndex = new Map();
for (let i = 0; i < universityMajors.length; i++) {
  const e = universityMajors[i];
  existingUMIndex.set(`${e.universityId}::${e.majorId}`, i);
}

let updatedUM = 0, addedUM = 0;
for (const [key, { uniId, majorId, quota }] of csvUniMajorMap) {
  if (quota === 0) continue; // 정원 0은 스킵
  const existing = existingUMIndex.get(`${uniId}::${majorId}`);
  if (existing !== undefined) {
    universityMajors[existing].admissionQuota = quota;
    updatedUM++;
  } else {
    universityMajors.push({ universityId: uniId, majorId, admissionQuota: quota });
    addedUM++;
  }
}

writeFileSync(
  `${SEED}/university_majors.json`,
  JSON.stringify(universityMajors, null, 2) + "\n",
  "utf-8"
);
console.log(`✅ university_majors.json: ${updatedUM}개 업데이트 / ${addedUM}개 신규 추가`);
console.log(`   총 매핑 수: ${universityMajors.length}개\n`);

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
