/**
 * scripts/generate-descriptions.ts
 *
 * Claude API로 학과 설명·과목 Subject 상세를 일괄 생성합니다.
 *
 * 핵심 원칙:
 *   - 결과는 JSON으로 저장하고 런타임 호출은 하지 않습니다 (비용 절감).
 *   - 생성 결과는 항상 data/_review_needed.json 에 기록되어 사람이 검수합니다.
 *   - 시스템 프롬프트로 톤·금지어·고등학생 눈높이를 강제합니다.
 *
 * 사용:
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/generate-descriptions.ts subjects
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/generate-descriptions.ts majors
 *
 * 결과:
 *   subjects → seed/subjects.generated.json (수동 머지 권장)
 *   majors   → seed/majors.generated.json
 *   둘 다  → data/_review_needed.json 항목 추가
 */

import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "node:fs";
import path from "node:path";

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 1024;

const SUBJECT_SYSTEM_PROMPT = `당신은 한국 고등학생을 위한 학과·과목 가이드 작성자입니다.

[작성 원칙]
- 고등학생 눈높이로 작성합니다. 처음 듣는 용어는 괄호로 짧게 풀어쓰세요. 예: "알고리즘(문제를 푸는 절차)"
- 실생활 또는 진로와 연결된 예시를 반드시 1개 이상 넣으세요. 예: "구글 지도가 최단 경로를 찾는 원리"
- 학과 선배가 후배에게 설명해주듯 친근하지만 정중한 톤(존댓말)을 사용합니다.
- summary는 50자 이내, description은 200~400자로 작성합니다.
- 사실 관계가 불확실하면 단정하지 않고 "보통", "주로", "학교마다 차이가 있어요" 같은 완충 표현을 사용합니다.

[출력 형식]
JSON 한 객체만 반환하세요 (코드 펜스 없이):
{
  "summary": "...",
  "description": "...",
  "realWorldExample": "...",
  "prerequisiteHS": ["수학", "정보"],
  "difficulty": 3
}`;

const MAJOR_SYSTEM_PROMPT = `당신은 한국 고등학생을 위한 학과 안내 작성자입니다.

[작성 원칙]
- 학과 소개는 3~5줄, 고등학생 눈높이의 친근한 존댓말로 작성합니다.
- 무엇을 배우고, 어떤 진로로 이어지는지를 균형 있게 다룹니다.
- 평균 연봉·취업률 등 수치는 "약" "대체로" 같은 완충 표현으로 처리하고 단정하지 마세요.
- careerPaths는 5~7개의 직업명 배열입니다 (간결히).

[출력 형식]
JSON 한 객체만 반환하세요:
{
  "description": "...",
  "keywords": ["..."],
  "careerPaths": ["..."]
}`;

type Anthropic_ = InstanceType<typeof Anthropic>;

async function generateSubject(
  client: Anthropic_,
  subjectName: string,
  year: number,
): Promise<unknown> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SUBJECT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `"${subjectName}" (대학교 ${year}학년 대표 과목)에 대한 Subject 객체를 작성해주세요.`,
      },
    ],
  });
  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text, _error: "json-parse-failed" };
  }
}

async function generateMajor(
  client: Anthropic_,
  majorName: string,
  category: string,
): Promise<unknown> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: MAJOR_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `"${majorName}" (${category}) 학과의 안내 객체를 작성해주세요.`,
      },
    ],
  });
  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text, _error: "json-parse-failed" };
  }
}

async function appendReview(entries: Array<{ kind: string; key: string }>) {
  const file = path.resolve(__dirname, "../data/_review_needed.json");
  let existing: unknown[] = [];
  try {
    existing = JSON.parse(await fs.readFile(file, "utf-8"));
  } catch {}
  await fs.writeFile(
    file,
    JSON.stringify([...existing, ...entries], null, 2),
    "utf-8",
  );
}

async function runSubjects() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY가 필요합니다.");
    process.exit(1);
  }
  const client = new Anthropic({ apiKey });

  // Inputs to generate. Edit this list or load from a planning file.
  const targets: Array<{ name: string; year: 1 | 2 | 3 | 4 }> = [
    // { name: "양자컴퓨팅 입문", year: 4 },
  ];
  if (targets.length === 0) {
    console.log("targets 배열을 채워 실행하세요.");
    return;
  }

  const results: Record<string, unknown> = {};
  const review: Array<{ kind: string; key: string }> = [];
  for (const { name, year } of targets) {
    console.log(`  · generating subject "${name}"`);
    results[name] = { id: name, name, year, ...((await generateSubject(client, name, year)) as object) };
    review.push({ kind: "subject", key: name });
  }
  const out = path.resolve(__dirname, "../seed/subjects.generated.json");
  await fs.writeFile(out, JSON.stringify(results, null, 2), "utf-8");
  await appendReview(review);
  console.log(`✓ ${Object.keys(results).length} subjects → ${out}`);
}

async function runMajors() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY가 필요합니다.");
    process.exit(1);
  }
  const client = new Anthropic({ apiKey });

  const targets: Array<{ name: string; category: string }> = [
    // { name: "양자정보학과", category: "공학계열" },
  ];
  if (targets.length === 0) {
    console.log("targets 배열을 채워 실행하세요.");
    return;
  }

  const results: Array<Record<string, unknown>> = [];
  const review: Array<{ kind: string; key: string }> = [];
  for (const { name, category } of targets) {
    console.log(`  · generating major "${name}"`);
    results.push({ name, category, ...((await generateMajor(client, name, category)) as object) });
    review.push({ kind: "major", key: name });
  }
  const out = path.resolve(__dirname, "../seed/majors.generated.json");
  await fs.writeFile(out, JSON.stringify(results, null, 2), "utf-8");
  await appendReview(review);
  console.log(`✓ ${results.length} majors → ${out}`);
}

const mode = process.argv[2];
(async () => {
  if (mode === "subjects") await runSubjects();
  else if (mode === "majors") await runMajors();
  else {
    console.log("Usage: tsx scripts/generate-descriptions.ts [subjects|majors]");
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
