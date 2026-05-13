/**
 * scripts/fetch-careernet.mjs
 *
 * 커리어넷 직업정보 API에서 전체 직업 목록을 가져와
 * seed/jobs.json 을 생성합니다.
 *
 * 실행:
 *   node scripts/fetch-careernet.mjs
 *   node scripts/fetch-careernet.mjs --dry-run
 *
 * 결과: seed/jobs.json
 *   - job_cd, job_nm, work, top_nm, aptit_name, wage, wlb, social, views, likes, rel_job_nm
 *   - relatedMajors: [] ← major_extras.json careerPaths 교차 매핑
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SEED = join(ROOT, "seed");

const API_KEY = "78411de1a2a7dfcd4ae37977f6eed056";
const BASE = "https://www.career.go.kr/cnet/front/openapi/jobs.json";

// ── 이름 정규화 ────────────────────────────────────────────────────────────
function normName(name) {
  return name
    .replace(/\s+/g, "")
    .replace(/[·\-·]/g, "")
    .toLowerCase();
}

// ── API 전체 페이지 fetch ─────────────────────────────────────────────────
async function fetchAllJobs() {
  // 1페이지로 total count 확인
  const firstUrl = `${BASE}?apiKey=${API_KEY}&pageIndex=1&pageCount=10`;
  const firstRes = await fetch(firstUrl);
  const firstData = await firstRes.json();
  const total = firstData.count;
  const pages = Math.ceil(total / 10);

  console.log(`  총 ${total}개 직업, ${pages}페이지 fetch 시작...`);

  const allJobs = [...firstData.jobs];

  // 나머지 페이지 (3개씩 병렬)
  for (let p = 2; p <= pages; p += 3) {
    const batch = [];
    for (let i = p; i < p + 3 && i <= pages; i++) {
      batch.push(
        fetch(`${BASE}?apiKey=${API_KEY}&pageIndex=${i}&pageCount=10`)
          .then((r) => r.json())
          .then((d) => d.jobs),
      );
    }
    const results = await Promise.all(batch);
    results.forEach((jobs) => allJobs.push(...jobs));
    process.stdout.write(`\r  fetch 완료: ${allJobs.length}/${total}`);
  }
  console.log();
  return allJobs;
}

// ── major ↔ job 교차 매핑 ─────────────────────────────────────────────────
function buildMajorJobMap(extras) {
  // careerPath → majorId[] 역방향 맵
  const pathToMajors = new Map();
  for (const [majorId, extra] of Object.entries(extras)) {
    if (!extra.careerPaths) continue;
    for (const path of extra.careerPaths) {
      const key = normName(path);
      if (!pathToMajors.has(key)) pathToMajors.set(key, []);
      pathToMajors.get(key).push(majorId);
    }
  }
  return pathToMajors;
}

function findRelatedMajors(job, pathToMajors) {
  const majorSet = new Set();

  // 체크할 직업명 목록: job_nm + rel_job_nm 분리
  const names = [job.job_nm];
  if (job.rel_job_nm) {
    names.push(
      ...job.rel_job_nm
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }

  for (const name of names) {
    const norm = normName(name);

    // 1차: 완전 일치
    if (pathToMajors.has(norm)) {
      pathToMajors.get(norm).forEach((id) => majorSet.add(id));
      continue;
    }

    // 2차: careerPath가 job 이름에 포함되거나 job 이름이 careerPath에 포함
    for (const [pathKey, majorIds] of pathToMajors) {
      if (norm.includes(pathKey) || pathKey.includes(norm)) {
        majorIds.forEach((id) => majorSet.add(id));
      }
    }
  }

  return [...majorSet];
}

// ── 메인 ─────────────────────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("\n커리어넷 직업정보 API 연동\n");

  // major_extras 로드
  const extras = JSON.parse(
    readFileSync(join(SEED, "major_extras.json"), "utf-8"),
  );
  const majors = JSON.parse(
    readFileSync(join(SEED, "majors.json"), "utf-8"),
  );

  console.log("  ▷ major careerPaths 역방향 맵 구축 중...");
  const pathToMajors = buildMajorJobMap(extras);
  console.log(`    → ${pathToMajors.size}개 직업명 키`);

  console.log("  ▷ 커리어넷 API 호출 중...");
  const rawJobs = await fetchAllJobs();
  console.log(`    → ${rawJobs.length}개 직업 수신`);

  // 매핑 수행
  console.log("  ▷ 학과 매핑 중...");
  let mappedCount = 0;
  const jobs = rawJobs.map((j) => {
    const relatedMajors = findRelatedMajors(j, pathToMajors);
    if (relatedMajors.length > 0) mappedCount++;
    return {
      job_cd: j.job_cd,
      job_nm: j.job_nm,
      work: j.work || "",
      top_nm: j.top_nm || "",
      aptit_name: j.aptit_name || "",
      wage: j.wage || "",
      wlb: j.wlb || "",
      social: j.social || "",
      views: j.views || 0,
      likes: j.likes || 0,
      rel_job_nm: j.rel_job_nm || "",
      relatedMajors,
    };
  });

  console.log(
    `    → ${mappedCount}/${jobs.length}개 직업에 학과 매핑 (${Math.round((mappedCount / jobs.length) * 100)}%)`,
  );

  // 카테고리별 통계
  const byCategory = {};
  jobs.forEach((j) => {
    byCategory[j.top_nm] = (byCategory[j.top_nm] || 0) + 1;
  });
  console.log("\n  직업 카테고리:");
  Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, cnt]) => console.log(`    ${cat}: ${cnt}개`));

  if (dryRun) {
    console.log("\n[dry-run] 저장 안 함. 샘플 3개:");
    console.log(
      JSON.stringify(
        jobs.filter((j) => j.relatedMajors.length > 0).slice(0, 3),
        null,
        2,
      ),
    );
    return;
  }

  writeFileSync(
    join(SEED, "jobs.json"),
    JSON.stringify(jobs, null, 2) + "\n",
    "utf-8",
  );
  console.log(`\n✅  seed/jobs.json 저장 완료 (${jobs.length}개 직업)`);
  console.log("   npm run build 를 실행해 정적 페이지를 재생성하세요.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
