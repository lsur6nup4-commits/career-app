/**
 * scripts/generate-extras.ts
 *
 * _review_needed.json 의 미보강 학과를 Claude API로 1개씩 생성해
 * seed/major_extras.json 에 즉시 머지합니다.
 * 중단해도 다음 실행 시 이어서 처리합니다.
 *
 * 사용:
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/generate-extras.ts
 *
 * 옵션:
 *   --batch <n>       한 번에 처리할 최대 개수 (기본: 전체)
 *   --start <n>       시작 번호 (1-based, 기본: 1)
 *   --dry-run         API 미호출, 대상 목록만 출력
 */

import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "node:fs";
import path from "node:path";

// ── 설정 ──────────────────────────────────────────────────────────────────
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 2048;
const DELAY_MS = 600; // rate-limit 여유

const ROOT = path.resolve(__dirname, "..");
const SEED = path.join(ROOT, "seed");
const DATA = path.join(ROOT, "data");
const EXTRAS_FILE = path.join(SEED, "major_extras.json");
const REVIEW_FILE = path.join(DATA, "_review_needed.json");

// ── 프롬프트 ──────────────────────────────────────────────────────────────
const SYSTEM = `당신은 한국 고등학생을 위한 학과 진로 정보 작성자입니다.

[작성 원칙]
- 고등학생이 진로 탐색에 실제 도움이 되는 정보를 제공합니다.
- careers.averageSalary는 만원/년 단위 정수입니다 (예: 5000 = 연 5000만원).
- employmentDistribution ratio 합계는 반드시 정확히 1.0이어야 합니다.
- books는 실제 존재하는 도서만 추천합니다.
- activities.type은 CLUB | CONTEST | VOLUNTEER | READING | PROJECT 중 하나.
- outlook.direction은 GROWING | STABLE | DECLINING | TRANSFORMING 중 하나.
- careers 5~7개, employmentDistribution 4~6개, certifications 2~5개,
  gradSchoolOptions 2~3개, industryTrends 3~5개, industryKeywords 5~8개,
  activities 4~5개, books 3~4개.
- 코드 펜스 없이 JSON 객체 하나만 반환하세요.

[출력 형식]
{
  "careers": [
    { "name": "직업명", "averageSalary": 5000, "summary": "30자 이내 한 줄 설명" }
  ],
  "employmentDistribution": [
    { "category": "분야명", "ratio": 0.4 }
  ],
  "certifications": ["자격증명"],
  "gradSchoolOptions": ["대학원 옵션"],
  "industryTrends": ["트렌드 한 줄"],
  "outlook": { "direction": "GROWING", "summary": "50자 이내 전망 요약" },
  "industryKeywords": ["키워드"],
  "activities": [
    { "type": "CLUB", "title": "활동명", "description": "활동 설명" }
  ],
  "books": [
    { "title": "책 제목", "author": "저자명", "summary": "한 줄 요약" }
  ]
}`;

// ── 타입 ──────────────────────────────────────────────────────────────────
type MissingItem = { id: string; name: string; category: string };
type ReviewFile = {
  _note: string;
  majors_missing_extras: { count: number; items: MissingItem[] };
  [key: string]: unknown;
};

// ── 헬퍼 ──────────────────────────────────────────────────────────────────
async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf-8")) as T;
}

async function writeJson(file: string, data: unknown) {
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseJsonSafe(text: string): unknown | null {
  // 1차: 직접 파싱
  try { return JSON.parse(text); } catch {}
  // 2차: 코드 펜스 제거 후 파싱
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) { try { return JSON.parse(m[1]); } catch {} }
  // 3차: 첫 { 부터 마지막 } 까지 추출
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

// ── API 호출 ──────────────────────────────────────────────────────────────
async function generateExtras(
  client: InstanceType<typeof Anthropic>,
  major: MissingItem,
): Promise<{ data: unknown; ok: boolean }> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `"${major.name}" (${major.category}) 학과의 진로 정보 객체를 작성해 주세요.`,
      },
    ],
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const parsed = parseJsonSafe(text);
  if (parsed) return { data: parsed, ok: true };
  return { data: { _raw: text.slice(0, 200), _error: "json-parse-failed" }, ok: false };
}

// ── 메인 ─────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  const batchIdx = args.indexOf("--batch");
  const batchSize = batchIdx !== -1 ? parseInt(args[batchIdx + 1], 10) : Infinity;

  const startIdx = args.indexOf("--start");
  const startFrom = startIdx !== -1 ? parseInt(args[startIdx + 1], 10) - 1 : 0; // 0-based

  // API 키 확인
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !dryRun) {
    console.error("❌  ANTHROPIC_API_KEY 환경 변수가 없습니다.");
    console.error("   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/generate-extras.ts");
    process.exit(1);
  }

  // ── 대상 목록 ──────────────────────────────────────────────────────────
  const review = await readJson<ReviewFile>(REVIEW_FILE);
  const allMissing = review.majors_missing_extras.items;

  // 이미 extras에 있는 항목 제외
  const existing = await readJson<Record<string, unknown>>(EXTRAS_FILE);
  const todo = allMissing.filter((m) => !(m.id in existing));

  // 대학 등장 횟수 기준 정렬 (높은 순)
  const um = await readJson<{ majorId: string }[]>(
    path.join(SEED, "university_majors.json"),
  );
  const uniCounts: Record<string, number> = {};
  for (const { majorId } of um) {
    uniCounts[majorId] = (uniCounts[majorId] ?? 0) + 1;
  }
  todo.sort((a, b) => (uniCounts[b.id] ?? 0) - (uniCounts[a.id] ?? 0));

  // 범위 슬라이싱
  const targets = todo.slice(startFrom, startFrom + batchSize);

  console.log(`\n📋 미처리 전체: ${todo.length}개 / 이번 배치: ${targets.length}개`);
  console.log(`   (이미 완료: ${allMissing.length - todo.length}개)\n`);

  if (targets.length === 0) {
    console.log("✅  처리할 항목이 없습니다.");
    return;
  }

  if (dryRun) {
    console.table(
      targets.map((m, i) => ({
        "#": startFrom + i + 1,
        id: m.id,
        name: m.name,
        unis: uniCounts[m.id] ?? 0,
      })),
    );
    return;
  }

  // ── 생성 루프 ──────────────────────────────────────────────────────────
  const client = new Anthropic({ apiKey: apiKey! });
  let okCount = 0;
  let failCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const major = targets[i];
    const num = startFrom + i + 1;
    const pct = Math.round(((i + 1) / targets.length) * 100);
    process.stdout.write(
      `[${num}/${startFrom + targets.length}] ${major.name} (${major.id}) ... `,
    );

    try {
      const { data, ok } = await generateExtras(client, major);

      // ── 즉시 major_extras.json에 머지 ──────────────────────────────
      const extrasNow = await readJson<Record<string, unknown>>(EXTRAS_FILE);
      extrasNow[major.id] = data;
      await writeJson(EXTRAS_FILE, extrasNow);

      // ── _review_needed.json에서 해당 항목 제거 ──────────────────────
      const reviewNow = await readJson<ReviewFile>(REVIEW_FILE);
      reviewNow.majors_missing_extras.items = reviewNow.majors_missing_extras.items.filter(
        (x) => x.id !== major.id,
      );
      reviewNow.majors_missing_extras.count = reviewNow.majors_missing_extras.items.length;
      await writeJson(REVIEW_FILE, reviewNow);

      if (ok) {
        okCount++;
        console.log(`✓  (${pct}%)`);
      } else {
        failCount++;
        console.log(`⚠  JSON 파싱 실패 — _raw 저장됨 (${pct}%)`);
      }
    } catch (err: unknown) {
      failCount++;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`✗  ${msg}`);
    }

    if (i < targets.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n✅  완료: ${okCount}개 성공, ${failCount}개 실패`);
  console.log(`   seed/major_extras.json 에 자동 머지되었습니다.`);
  if (failCount > 0) {
    console.log(`   ⚠  _error 항목은 seed/major_extras.json 에서 검수 후 수정하세요.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
