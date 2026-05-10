import type { DiagnosisAnswers, DiagnosisResult } from "@/types/diagnosis";

const ANSWERS_KEY = "diagnosis_answers_v1";
const RESULT_KEY = "diagnosis_result_v1";

export function loadAnswers(): DiagnosisAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DiagnosisAnswers;
  } catch {
    return null;
  }
}

export function saveAnswers(answers: DiagnosisAnswers): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANSWERS_KEY);
}

export function loadResult(): DiagnosisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DiagnosisResult;
  } catch {
    return null;
  }
}

export function saveResult(result: DiagnosisResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function clearResult(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESULT_KEY);
}

export function emptyAnswers(): DiagnosisAnswers {
  return {
    likert: {},
    subjects: [],
    interests: [],
    currentIndex: 0,
    startedAt: Date.now(),
  };
}
