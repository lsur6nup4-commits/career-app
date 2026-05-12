/**
 * scripts/import-edu-data.ts
 *
 * 한국교육개발원(KEDI) 교육통계서비스 데이터맵에서 받아온
 * CSV/Excel 파일을 파싱해 seed/*.json 형식으로 변환합니다.
 *
 * data.edmgr.kr 에서 다음 데이터를 수동 다운로드한 뒤 `raw/` 폴더에 둡니다:
 *   raw/university-list.csv   학교현황 → 대학 분류
 *   raw/majors-classification.csv  학과분류표 (대→중→소분류)
 *   raw/admissions-quota.csv  대학·학과별 입학 정원 통계
 *
 * 실행:
 *   npx tsx scripts/import-edu-data.ts
 *
 * 결과:
 *   seed/universities.json  (병합 모드: 기존 ID 유지, 신규 추가)
 *   seed/university_majors.json
 *   data/_import_log.json  (변환 실패한 항목)
 *
 * ⚠ 현재는 스켈레톤입니다. 실제 KEDI CSV 컬럼명에 맞춰 parse() 함수를
 * 채워야 하며, 컬럼이 한글 그대로일 수 있으니 인코딩(UTF-8 BOM 또는
 * EUC-KR)에 주의하세요.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

type University = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  type: "NATIONAL" | "PRIVATE" | "SPECIAL";
};

type UniversityMajorEdge = {
  universityId: string;
  majorId: string;
  admissionQuota?: number;
};

const RAW = path.resolve(__dirname, "../raw");
const SEED = path.resolve(__dirname, "../seed");

/** Naive CSV reader (no embedded commas inside quoted fields). */
async function readCsv(file: string): Promise<Record<string, string>[]> {
  const text = await fs.readFile(file, "utf-8");
  const [header, ...rows] = text.split(/\r?\n/).filter(Boolean);
  const cols = header.split(",").map((s) => s.trim());
  return rows.map((row) => {
    const values = row.split(",").map((s) => s.trim());
    return Object.fromEntries(cols.map((c, i) => [c, values[i] ?? ""]));
  });
}

function slugify(name: string): string {
  return name
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .toLowerCase();
}

function classifyType(raw: string): University["type"] {
  if (/국립|국공립/.test(raw)) return "NATIONAL";
  if (/특수|사관|국과수|KAIST|GIST|UNIST|DGIST/.test(raw)) return "SPECIAL";
  return "PRIVATE";
}

async function importUniversities(): Promise<University[]> {
  const csv = path.join(RAW, "university-list.csv");
  try {
    const rows = await readCsv(csv);
    const out: University[] = rows.map((r) => ({
      id: slugify(r["학교명"] ?? r["name"] ?? ""),
      name: r["학교명"] ?? r["name"] ?? "",
      shortName: r["약칭"] ?? r["학교명"] ?? "",
      region: r["소재지"] ?? r["region"] ?? "",
      type: classifyType(r["설립구분"] ?? r["type"] ?? ""),
    }));
    return out.filter((u) => u.id && u.name);
  } catch (e) {
    console.warn(`[importUniversities] ${csv} 없음 — 건너뜀`);
    return [];
  }
}

async function importUniversityMajors(): Promise<UniversityMajorEdge[]> {
  const csv = path.join(RAW, "admissions-quota.csv");
  try {
    const rows = await readCsv(csv);
    return rows.flatMap((r) => {
      const uid = slugify(r["학교명"] ?? "");
      const mid = slugify(r["학과명"] ?? r["전공명"] ?? "");
      const quota = Number(r["입학정원"] ?? r["정원"] ?? "");
      if (!uid || !mid) return [];
      return [{ universityId: uid, majorId: mid, admissionQuota: Number.isFinite(quota) ? quota : undefined }];
    });
  } catch (e) {
    console.warn(`[importUniversityMajors] ${csv} 없음 — 건너뜀`);
    return [];
  }
}

/** Merge new entries while preserving existing IDs. */
async function mergeUniversities(parsed: University[]): Promise<number> {
  const existingPath = path.join(SEED, "universities.json");
  const existing: University[] = JSON.parse(
    await fs.readFile(existingPath, "utf-8"),
  );
  const byId = new Map(existing.map((u) => [u.id, u]));
  let added = 0;
  for (const u of parsed) {
    if (!byId.has(u.id)) {
      byId.set(u.id, u);
      added += 1;
    }
  }
  await fs.writeFile(
    existingPath,
    JSON.stringify(Array.from(byId.values()), null, 2),
    "utf-8",
  );
  return added;
}

async function main() {
  const universities = await importUniversities();
  if (universities.length > 0) {
    const added = await mergeUniversities(universities);
    console.log(`Universities: parsed=${universities.length}, added=${added}`);
  }
  const edges = await importUniversityMajors();
  if (edges.length > 0) {
    console.log(`UniversityMajors edges: ${edges.length}`);
    // Manual review recommended before overwriting seed/university_majors.json
    await fs.writeFile(
      path.join(SEED, "_import_university_majors.json"),
      JSON.stringify(edges, null, 2),
      "utf-8",
    );
    console.log("→ seed/_import_university_majors.json 에 저장. 검수 후 수동 머지하세요.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
