/**
 * update-tuition.mjs
 * data/tuition_data.json × seed/universities.json 매핑
 * → universities.json tuitionAvg 필드 업데이트 (단위: 만원)
 *
 * 매칭 전략:
 *   1. 공백 제거 + 괄호 내용 제거 후 완전일치
 *   2. tuition명의 '국립/공립/사립' 접두어 제거 후 재시도
 *   3. _분교 / (캠퍼스명) 제거 후 포함 관계 매칭
 *   4. 수동 오버라이드 (이름이 다른 케이스)
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const tuitionRaw  = JSON.parse(readFileSync(path.join(ROOT, "data/tuition_data.json"), "utf8"));
const universities = JSON.parse(readFileSync(path.join(ROOT, "seed/universities.json"), "utf8"));

// ── 정규화 ────────────────────────────────────────────────────────────────
/** 공백, 괄호 내용 제거 */
function normBase(s) {
  return s
    .replace(/\s+/g, "")
    .replace(/[（(（][^）)）]*[）)）]/g, "")  // 괄호 제거
    .replace(/_분교$/, "");                   // _분교 제거
}

/** tuition 전용: 국립/공립/사립 접두어 추가 제거 */
function normT(s) {
  return normBase(s).replace(/^(국립|공립|사립)/, "");
}

// ── 수동 오버라이드 (university.name → tuition.name) ─────────────────────
// 캠퍼스명·국공립 접두사·다른 표기로 인한 매칭 결렬 해결.
const MANUAL = {
  // ── 가톨릭/한국 prefix 차이 ──────────────────────────────────────────
  "꽃동네대학교":            "가톨릭꽃동네대학교",
  "성서대학교":              "한국성서대학교",
  "한국기술대학교":          "한국기술교육대학교",
  // ── 국립/공립 prefix 차이 ───────────────────────────────────────────
  "공주대학교":              "국립공주대학교",
  "한국해양대학교":          "국립한국해양대학교",
  "부경대학교":              "국립부경대학교",
  "창원대학교":              "국립창원대학교",
  "한밭대학교":              "국립한밭대학교",
  "울산국립대학교":          "국립울산대학교",
  "안동대학교":              "국립안동대학교",
  "경상대학교(별칭)":        "경상국립대학교",
  // ── 캠퍼스 분교 (별도 등록금 공시 존재) ──────────────────────────────
  "연세대 미래캠퍼스":       "연세대학교(미래) _분교",
  "고려대학교(세종캠퍼스)":  "고려대학교(세종) _분교",
  "건국대학교(글로컬캠퍼스)": "건국대학교(글로컬) _분교",
  // ── 캠퍼스 분교 (본교 데이터 사용, 별도 공시 없음) ───────────────────
  "경희대학교(국제캠퍼스)":  "경희대학교",
  "가천대(글로컬)":          "가천대학교",
  "한동대학교":              "한동대학교",
  // ── 기타 이름 변형 ───────────────────────────────────────────────────
  "경인국립대학교":          "경인교육대학교",
  "공주문화관광대학교":      "공주문화대학교",
  "군산대(해양)":            "국립군산대학교",
  "공주대(예산)":            "국립공주대학교",
  "순천향대(아산)":          "순천향대학교",
  "대구가톨릭대(분교)":      "대구가톨릭대학교",
  "용인대(체대 강세)":       "용인대학교",
  "한국교통대(기술)":        "한국교통대학교",
  "한국폴리텍(용인)":        "한국폴리텍대학교",
};

// ── tuition 이름 → 값 맵 (여러 정규화 키) ────────────────────────────────
// 같은 대학이 여러 행(캠퍼스별)인 경우 평균 처리
const tByNormBase = new Map();  // normBase(name) → {sum, cnt}
const tByNormT    = new Map();  // normT(name) → {sum, cnt}

function addT(map, key, val) {
  if (!map.has(key)) map.set(key, { sum: 0, cnt: 0 });
  const e = map.get(key);
  e.sum += val; e.cnt++;
}

for (const row of tuitionRaw) {
  addT(tByNormBase, normBase(row.name), row.tuitionAvg);
  addT(tByNormT,    normT(row.name),    row.tuitionAvg);
}

function avgOf(map, key) {
  const e = map.get(key);
  return e ? Math.round(e.sum / e.cnt / 10000) : null;  // 원 → 만원
}

// ── 매핑 실행 ─────────────────────────────────────────────────────────────
let matched = 0, skipped = 0;
const matchLog = [];

for (const univ of universities) {
  // 수동 오버라이드
  const manualName = MANUAL[univ.name];
  if (manualName) {
    const key1 = normBase(manualName);
    const key2 = normT(manualName);
    const val = avgOf(tByNormBase, key1) ?? avgOf(tByNormT, key2);
    if (val !== null) {
      univ.tuitionAvg = val;
      matched++;
      matchLog.push(`[manual] ${univ.name} → ${manualName} → ${val}만원`);
      continue;
    }
  }

  // 1단계: normBase 완전일치
  const nb = normBase(univ.name);
  let val = avgOf(tByNormBase, nb);
  if (val !== null) {
    univ.tuitionAvg = val;
    matched++;
    matchLog.push(`[exact ] ${univ.name} → ${val}만원`);
    continue;
  }

  // 2단계: normT (국립/공립 접두어 제거) 완전일치
  val = avgOf(tByNormT, nb);  // university 이름으로 normT 맵에서도 탐색
  if (val !== null) {
    univ.tuitionAvg = val;
    matched++;
    matchLog.push(`[normT ] ${univ.name} → ${val}만원`);
    continue;
  }

  // 3단계: univ 이름(normBase)이 tuition normT 키에 포함되는지 포함 매칭
  // e.g. university "안동대학교" normBase="안동대학교", tuition "국립안동대학교" normT="안동대학교"
  const fallback = avgOf(tByNormT, nb);
  if (fallback !== null) {
    univ.tuitionAvg = fallback;
    matched++;
    matchLog.push(`[fallbk] ${univ.name} → ${fallback}만원`);
    continue;
  }

  // 미매칭 → tuitionAvg 없음
  if (univ.tuitionAvg !== undefined) delete univ.tuitionAvg;
  skipped++;
}

// ── 저장 ─────────────────────────────────────────────────────────────────
writeFileSync(
  path.join(ROOT, "seed/universities.json"),
  JSON.stringify(universities, null, 2),
  "utf8"
);

console.log(`✅  저장 완료: seed/universities.json`);
console.log(`   매칭 성공: ${matched}개 / ${universities.length}개`);
console.log(`   미매칭:   ${skipped}개 (등록금 데이터 없음)`);
console.log(`\n   매칭 상세 (처음 30개):`);
matchLog.slice(0, 30).forEach(l => console.log("  ", l));
if (matchLog.length > 30) console.log(`  ... 외 ${matchLog.length - 30}개`);
