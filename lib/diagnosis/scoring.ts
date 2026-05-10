import questionsBundle from "@/seed/diagnosis_questions.json";
import { getAllMajors } from "@/lib/majors";
import {
  HOLLAND_LABELS,
  INTEREST_TO_MAJORS,
  SUBJECT_TO_MAJORS,
} from "@/lib/diagnosis/mappings";
import type {
  DiagnosisAnswers,
  DiagnosisResult,
  HollandScores,
  HollandType,
  QuestionsBundle,
  RecommendedMajor,
} from "@/types/diagnosis";

const QUESTIONS = questionsBundle as QuestionsBundle;

const HOLLAND_TYPES: HollandType[] = ["R", "I", "A", "S", "E", "C"];

export function getQuestionsBundle(): QuestionsBundle {
  return QUESTIONS;
}

export function totalSteps(): number {
  return QUESTIONS.holland.length + 2;
}

function computeHollandScores(likert: Record<string, number>): HollandScores {
  const sums: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const q of QUESTIONS.holland) {
    const value = likert[q.id];
    if (typeof value !== "number") continue;
    sums[q.type] += value;
    counts[q.type] += 1;
  }

  const result: HollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const t of HOLLAND_TYPES) {
    if (counts[t] === 0) continue;
    const max = counts[t] * 5;
    result[t] = Math.round((sums[t] / max) * 100);
  }
  return result;
}

function topNHollandTypes(scores: HollandScores, n = 2): HollandType[] {
  return [...HOLLAND_TYPES].sort((a, b) => scores[b] - scores[a]).slice(0, n);
}

function hollandFitScore(
  majorTags: string[],
  scores: HollandScores,
): number {
  if (!majorTags.length) return 50;
  const validTags = majorTags.filter((t): t is HollandType =>
    HOLLAND_TYPES.includes(t as HollandType),
  );
  if (!validTags.length) return 50;
  const avg =
    validTags.reduce((sum, t) => sum + scores[t], 0) / validTags.length;
  return Math.round(avg);
}

function listMatchScore(
  majorId: string,
  selected: string[],
  mapping: Record<string, string[]>,
): number {
  if (!selected.length) return 50;
  const matched = selected.filter((s) => mapping[s]?.includes(majorId)).length;
  return Math.round((matched / selected.length) * 100);
}

function reasonText(
  majorName: string,
  topTypes: HollandType[],
  matchedTypes: HollandType[],
  matchedInterests: string[],
): string {
  const parts: string[] = [];
  if (matchedTypes.length) {
    const typeText = matchedTypes
      .map((t) => `${HOLLAND_LABELS[t]}(${t})`)
      .join("·");
    parts.push(`${typeText} 성향과 잘 맞아요`);
  } else if (topTypes.length) {
    parts.push(`${HOLLAND_LABELS[topTypes[0]]} 성향에 가까워요`);
  }
  if (matchedInterests.length) {
    parts.push(`관심 분야 "${matchedInterests.slice(0, 2).join(", ")}"와 연결돼요`);
  }
  return parts.length ? parts.join(" · ") : `${majorName} 분야 학생들이 자주 선택해요`;
}

export function computeResult(answers: DiagnosisAnswers): DiagnosisResult {
  const hollandScores = computeHollandScores(answers.likert);
  const topTypes = topNHollandTypes(hollandScores, 2);
  const majors = getAllMajors();

  const recommendations: RecommendedMajor[] = majors.map((m) => {
    const hScore = hollandFitScore(m.hollandTags, hollandScores);
    const iScore = listMatchScore(m.id, answers.interests, INTEREST_TO_MAJORS);
    const sScore = listMatchScore(m.id, answers.subjects, SUBJECT_TO_MAJORS);

    const final = Math.round(0.65 * hScore + 0.2 * iScore + 0.15 * sScore);

    const matchedTypes = m.hollandTags.filter((t): t is HollandType =>
      topTypes.includes(t as HollandType),
    );
    const matchedInterests = answers.interests.filter((i) =>
      INTEREST_TO_MAJORS[i]?.includes(m.id),
    );

    return {
      majorId: m.id,
      name: m.name,
      category: m.category,
      summary: m.summary,
      score: Math.min(100, final),
      reason: reasonText(m.name, topTypes, matchedTypes, matchedInterests),
    };
  });

  recommendations.sort((a, b) => b.score - a.score);

  const allMajorScores: Record<string, number> = {};
  for (const r of recommendations) {
    allMajorScores[r.majorId] = r.score;
  }

  return {
    hollandScores,
    topHollandTypes: topTypes,
    topMajors: recommendations.slice(0, 10),
    allMajorScores,
    selectedSubjects: answers.subjects,
    selectedInterests: answers.interests,
    computedAt: Date.now(),
  };
}
