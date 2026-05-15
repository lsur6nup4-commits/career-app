/**
 * scripts/enrich-descriptions.mjs
 *
 * seed/majors.json 의 description 길이가 50자 이하인 학과들을
 * Claude Haiku API로 80자 이상으로 보강합니다.
 *
 * 실행: node scripts/enrich-descriptions.mjs
 *  - .env.local 의 ANTHROPIC_API_KEY 사용
 *  - 동시 5개 병렬 호출
 *  - seed/majors.json 직접 업데이트
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// .env.local 로드
function loadEnv() {
  try {
    const raw = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnv();

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("❌ ANTHROPIC_API_KEY가 없습니다.");
  process.exit(1);
}

const client = new Anthropic({ apiKey });
const MODEL = "claude-haiku-4-5";
const CONCURRENCY = 5;

const SYSTEM_PROMPT = `당신은 한국 고등학생을 위한 학과 안내 작성자입니다.

[작성 원칙]
- 2~3문장으로 80자 이상 작성. (너무 길지 않게, 120자 이내 권장)
- 학과에서 배우는 내용 + 진출 분야를 균형 있게 다룹니다.
- 친근한 평어/존댓말 (예: "~합니다", "~예요").
- 평균 연봉, 취업률 같은 수치는 단정하지 마세요.
- 학과의 핵심 특징을 살리되, 일반적인 표현으로 작성.

[참고 스타일]
- "프로그래밍, 자료구조, 알고리즘부터 운영체제, 네트워크, 인공지능까지 컴퓨터 과학 전반을 다룹니다. 수학적 사고와 문제 해결 능력이 중요하며, 다양한 산업의 핵심 기술 분야로 자리잡고 있습니다." (108자)
- "회로 설계, 반도체, 통신, 제어 시스템 등 전기와 전자 기술을 종합적으로 다룹니다. 한국의 핵심 산업과 직접 연결되어 있는 대표 공학 분야입니다." (82자)

[출력]
description 텍스트만 반환하세요. JSON, 따옴표, 코드펜스 모두 금지.`;

async function generateDescription(major) {
  const userMsg = `학과명: ${major.name}
계열: ${major.category}
기존 짧은 설명: "${major.description}"
한 줄 요약: ${major.summary ?? "(없음)"}
키워드: ${(major.keywords ?? []).slice(0, 5).join(", ")}

위 학과의 description을 80자 이상으로 보강해주세요.`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMsg }],
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^description\s*[:=]\s*/i, "");

  return text;
}

// ── 동시 N개 병렬 처리 ────────────────────────────────────────────────────
async function runBatch(tasks, concurrency) {
  const results = new Array(tasks.length);
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const myIdx = idx++;
      try {
        results[myIdx] = await tasks[myIdx]();
      } catch (e) {
        results[myIdx] = { error: e.message };
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ── 메인 실행 ─────────────────────────────────────────────────────────────
const majorsPath = resolve(ROOT, "seed/majors.json");
const majors = JSON.parse(readFileSync(majorsPath, "utf-8"));

const targets = majors.filter(
  (m) => !m.description || m.description.length <= 50,
);

console.log(`🎯 보강 대상: ${targets.length}개 학과 (전체 ${majors.length}개)\n`);

if (targets.length === 0) {
  console.log("✅ 보강할 학과가 없습니다.");
  process.exit(0);
}

const tasks = targets.map((m) => async () => {
  const newDesc = await generateDescription(m);
  return { major: m, newDescription: newDesc };
});

console.log(`⏳ Claude Haiku API 호출 시작 (${CONCURRENCY} 동시)...\n`);
const startTime = Date.now();
const results = await runBatch(tasks, CONCURRENCY);
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

// 결과 처리
let success = 0;
let failed = 0;
const failedItems = [];

for (const r of results) {
  if (r.error || !r.newDescription) {
    failed++;
    failedItems.push({ name: r.major?.name, error: r.error });
    continue;
  }
  if (r.newDescription.length < 80) {
    console.warn(
      `⚠️  [${r.major.name}] 생성 결과 ${r.newDescription.length}자 (80자 미만): "${r.newDescription}"`,
    );
  }
  // majors 배열에서 해당 학과 찾아서 업데이트
  const target = majors.find((m) => m.id === r.major.id);
  if (target) {
    target.description = r.newDescription;
    success++;
  }
}

writeFileSync(majorsPath, JSON.stringify(majors, null, 2) + "\n");

console.log();
console.log(`✅ 완료: ${success}개 학과 description 보강 (${elapsed}초)`);
if (failed > 0) {
  console.log(`❌ 실패: ${failed}개`);
  failedItems.forEach((f) => console.log(`   - ${f.name}: ${f.error}`));
}

// 검증
const after = JSON.parse(readFileSync(majorsPath, "utf-8"));
const stillShort = after.filter(
  (m) => !m.description || m.description.length <= 50,
).length;
console.log(`\n📊 남은 50자 이하 학과: ${stillShort}개`);
