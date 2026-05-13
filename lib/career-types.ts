import careerTypesRaw from "@/data/career-types.json";
import majorsJson from "@/seed/majors.json";
import type {
  CareerTypesData,
  CareerType,
  CareerTypeQuestion,
  AxisScores,
  QuizResult,
} from "@/types/career-type";
import type { Major } from "@/types/major";

const data = careerTypesRaw as unknown as CareerTypesData;
const majors = majorsJson as Major[];

export function getCareerTypesData(): CareerTypesData {
  return data;
}

export function getAllCareerTypes(): CareerType[] {
  return Object.values(data.types);
}

export function getCareerType(code: string): CareerType | null {
  return data.types[code] ?? null;
}

export function getQuestions(): CareerTypeQuestion[] {
  return data.questions as CareerTypeQuestion[];
}

/** 답변 배열로 유형 코드 + 축 점수 계산 */
export function computeResult(
  answers: Record<number, string>,
  questions: CareerTypeQuestion[],
): QuizResult {
  const scores: AxisScores = { T: 0, I: 0, P: 0, O: 0, S: 0, C: 0, E: 0, M: 0 };
  for (const q of questions) {
    const val = answers[q.id] as keyof AxisScores | undefined;
    if (val && val in scores) scores[val]++;
  }
  const code = [
    scores.T >= scores.I ? "T" : "I",
    scores.P >= scores.O ? "P" : "O",
    scores.S >= scores.C ? "S" : "C",
    scores.E >= scores.M ? "E" : "M",
  ].join("");
  return { typeCode: code, scores };
}

/** 추천 학과 Major 객체 목록 */
export function getRecommendedMajors(type: CareerType): Major[] {
  return type.recommendedMajors
    .map((id) => majors.find((m) => m.id === id))
    .filter((m): m is Major => m !== undefined);
}

/** localStorage 저장 키 */
export const CAREER_TYPE_RESULT_KEY = "career_type_result_v1";

export function saveCareerTypeResult(result: QuizResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAREER_TYPE_RESULT_KEY, JSON.stringify(result));
}

export function loadCareerTypeResult(): QuizResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CAREER_TYPE_RESULT_KEY);
    return raw ? (JSON.parse(raw) as QuizResult) : null;
  } catch {
    return null;
  }
}
