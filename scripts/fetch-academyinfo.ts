/**
 * scripts/fetch-academyinfo.ts
 *
 * 대학알리미 OpenAPI 에서 실제 대학 정보·등록금을 가져와
 * seed/universities.json 을 업데이트합니다.
 *
 * 사전 조건:
 *   - .env.local 에 ACADEMY_API_KEY 설정 (openapi.academyinfo.go.kr)
 *   - 키가 공공데이터포털에서 승인 완료 상태여야 합니다.
 *
 * 실행:
 *   npx tsx scripts/fetch-academyinfo.ts
 *   npx tsx scripts/fetch-academyinfo.ts --dry-run   # 업데이트 없이 결과만 출력
 *   npx tsx scripts/fetch-academyinfo.ts --year 2023 # 조사연도 지정
 *
 * 업데이트 필드:
 *   schoolCode, homepageUrl, establishedYear, totalStudents,
 *   tuitionAvg, admissionQuotaTotal
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import * as dotenv from "dotenv";

// .env.local 로드 (tsx 실행 시 자동 로드 안 됨)
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const ROOT = path.resolve(__dirname, "..");
const SEED = path.join(ROOT, "seed");
const UNI_FILE = path.join(SEED, "universities.json");

const BASE = "http://openapi.academyinfo.go.kr/openapi/service/rest";
const ROWS = 300; // 한 번에 최대 수신 행 수

// ── 타입 ──────────────────────────────────────────────────────────────────
type University = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  type: string;
  schoolCode?: string;
  homepageUrl?: string;
  establishedYear?: number;
  totalStudents?: number;
  tuitionAvg?: number;
  admissionQuotaTotal?: number;
};

type SchoolRow = {
  schoolCode: string;
  name: string;
  homepageUrl?: string;
  establishedYear?: number;
  totalStudents?: number;
  admissionQuotaTotal?: number;
};

type FinanceRow = {
  schoolCode: string;
  tuitionAvg: number;
};

// ── XML 파서 (경량 자체 구현, 외부 의존 없음) ─────────────────────────────
function xmlVal(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : "";
}

function xmlItems(xml: string): string[] {
  const items: string[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) items.push(m[1]);
  return items;
}

function parseNum(s: string): number | undefined {
  const n = parseInt(s.replace(/,/g, ""), 10);
  return isNaN(n) ? undefined : n;
}

// ── API 호출 ──────────────────────────────────────────────────────────────
async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { Accept: "application/xml, text/xml, */*" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

async function fetchAllPages(
  endpoint: string,
  apiKey: string,
  extraParams: Record<string, string> = {},
): Promise<string[]> {
  const base = `${BASE}/${endpoint}?serviceKey=${encodeURIComponent(apiKey)}&numOfRows=${ROWS}`;
  const extra = Object.entries(extraParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  // 1페이지 먼저 가져와서 totalCount 확인
  const first = await fetchXml(`${base}&pageNo=1${extra ? "&" + extra : ""}`);
  const code = xmlVal(first, "resultCode");
  if (code !== "00") {
    const msg = xmlVal(first, "resultMsg");
    throw new Error(`API 오류 [${code}]: ${msg}`);
  }

  const total = parseInt(xmlVal(first, "totalCount"), 10) || 0;
  const pages = Math.ceil(total / ROWS);
  const allItems = [...xmlItems(first)];

  for (let p = 2; p <= pages; p++) {
    const xml = await fetchXml(`${base}&pageNo=${p}${extra ? "&" + extra : ""}`);
    allItems.push(...xmlItems(xml));
  }
  return allItems;
}

// ── SchoolInfo 파싱 ───────────────────────────────────────────────────────
async function fetchSchoolInfo(
  apiKey: string,
  svyYr: string,
): Promise<SchoolRow[]> {
  console.log("  ▷ SchoolInfoService/getSchoolInfo 호출 중...");
  // schulKnd=04 : 대학교
  const items = await fetchAllPages(
    "SchoolInfoService/getSchoolInfo",
    apiKey,
    { svyYr, schulKnd: "04" },
  );
  console.log(`    → ${items.length}개 항목 수신`);

  return items.map((item) => ({
    schoolCode: xmlVal(item, "SCHOOL_CD") || xmlVal(item, "schoolCd"),
    name: xmlVal(item, "SCHOOL_NM") || xmlVal(item, "schoolNm"),
    homepageUrl: xmlVal(item, "HMPG_URL") || xmlVal(item, "hmpgUrl") || undefined,
    establishedYear: parseNum(
      xmlVal(item, "FOND_DYEAR") || xmlVal(item, "fondDyear"),
    ),
    totalStudents: parseNum(
      xmlVal(item, "STNT_CNT") || xmlVal(item, "stntCnt"),
    ),
    admissionQuotaTotal: parseNum(
      xmlVal(item, "ENTRC_SCRG") ||
        xmlVal(item, "entrScrg") ||
        xmlVal(item, "ENTR_SCG"),
    ),
  }));
}

// ── FinanceInfo 파싱 ──────────────────────────────────────────────────────
async function fetchFinanceInfo(
  apiKey: string,
  svyYr: string,
): Promise<FinanceRow[]> {
  console.log("  ▷ FinanceInfoService/getFinanceInfo 호출 중...");
  const items = await fetchAllPages(
    "FinanceInfoService/getFinanceInfo",
    apiKey,
    { svyYr },
  );
  console.log(`    → ${items.length}개 항목 수신`);

  // 등록금 관련 필드: REGIST_FEE, tuitionFee 등 API 버전마다 다름
  return items.map((item) => {
    const fee =
      parseNum(xmlVal(item, "REGIST_FEE")) ??
      parseNum(xmlVal(item, "registFee")) ??
      parseNum(xmlVal(item, "TUITION_FEE")) ??
      parseNum(xmlVal(item, "tuitionFee")) ??
      0;
    return {
      schoolCode:
        xmlVal(item, "SCHOOL_CD") || xmlVal(item, "schoolCd"),
      // 원 단위 → 만원 단위 변환 (100만원 이상이면 원 단위로 가정)
      tuitionAvg: fee > 1_000_000 ? Math.round(fee / 10_000) : fee,
    };
  });
}

// ── 이름 매칭 ─────────────────────────────────────────────────────────────
/** 대학명 정규화: 공백·특수문자 제거, 소문자 */
function normalize(name: string): string {
  return name
    .replace(/\s+/g, "")
    .replace(/[()（）\[\]·]/g, "")
    .toLowerCase();
}

function matchByName(
  uniName: string,
  apiRows: SchoolRow[],
): SchoolRow | undefined {
  const norm = normalize(uniName);
  // 1차: 완전 일치
  let found = apiRows.find((r) => normalize(r.name) === norm);
  if (found) return found;
  // 2차: "대학교" 제거 후 일치
  const stripped = norm.replace(/대학교$/, "").replace(/대학$/, "");
  found = apiRows.find((r) => {
    const rn = normalize(r.name);
    return (
      rn.replace(/대학교$/, "").replace(/대학$/, "") === stripped
    );
  });
  return found;
}

// ── 메인 ─────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const yearIdx = args.indexOf("--year");
  const svyYr = yearIdx !== -1 ? args[yearIdx + 1] : "2023";

  const apiKey = process.env.ACADEMY_API_KEY;
  if (!apiKey) {
    console.error("❌  ACADEMY_API_KEY 환경 변수가 없습니다.");
    console.error("   .env.local 에 ACADEMY_API_KEY=<키> 를 설정하세요.");
    process.exit(1);
  }

  console.log(`\n대학알리미 API 연동 (조사연도: ${svyYr})\n`);

  // ── API 호출 ──────────────────────────────────────────────────────────
  let schoolRows: SchoolRow[] = [];
  let financeRows: FinanceRow[] = [];

  try {
    schoolRows = await fetchSchoolInfo(apiKey, svyYr);
  } catch (e) {
    console.error(`❌  SchoolInfoService 호출 실패: ${e}`);
    console.error("   API 키 활성화 여부와 네트워크를 확인하세요.");
    process.exit(1);
  }

  try {
    financeRows = await fetchFinanceInfo(apiKey, svyYr);
  } catch (e) {
    console.warn(`⚠  FinanceInfoService 호출 실패 (등록금 미반영): ${e}`);
  }

  // schoolCode → finance 맵
  const financeMap = new Map<string, number>();
  for (const f of financeRows) {
    if (f.schoolCode && f.tuitionAvg > 0) {
      financeMap.set(f.schoolCode, f.tuitionAvg);
    }
  }

  // ── universities.json 업데이트 ────────────────────────────────────────
  const unis: University[] = JSON.parse(
    await fs.readFile(UNI_FILE, "utf-8"),
  );

  let matched = 0;
  let unmatched = 0;

  const updated = unis.map((uni) => {
    const row = matchByName(uni.name, schoolRows);
    if (!row) {
      unmatched++;
      return uni;
    }
    matched++;

    const tuition = row.schoolCode
      ? financeMap.get(row.schoolCode)
      : undefined;

    const patch: Partial<University> = {
      schoolCode: row.schoolCode || undefined,
      homepageUrl: row.homepageUrl || undefined,
      establishedYear: row.establishedYear,
      totalStudents: row.totalStudents,
      admissionQuotaTotal: row.admissionQuotaTotal,
      ...(tuition !== undefined ? { tuitionAvg: tuition } : {}),
    };

    // undefined 필드 제거
    (Object.keys(patch) as (keyof typeof patch)[]).forEach((k) => {
      if (patch[k] === undefined) delete patch[k];
    });

    return { ...uni, ...patch };
  });

  console.log(`\n매칭 결과: ${matched}개 성공 / ${unmatched}개 미매칭`);

  if (dryRun) {
    console.log("\n[dry-run] 업데이트 미적용. 샘플 5개:");
    console.log(
      JSON.stringify(
        updated.filter((u) => u.schoolCode).slice(0, 5),
        null,
        2,
      ),
    );
    return;
  }

  await fs.writeFile(
    UNI_FILE,
    JSON.stringify(updated, null, 2) + "\n",
    "utf-8",
  );
  console.log(`✅  ${UNI_FILE} 업데이트 완료`);
  console.log("   npm run build 를 실행해 정적 페이지를 재생성하세요.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
