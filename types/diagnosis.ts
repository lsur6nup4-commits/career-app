export type HollandType = "R" | "I" | "A" | "S" | "E" | "C";

export type LikertQuestion = {
  id: string;
  type: HollandType;
  text: string;
};

export type QuestionsBundle = {
  holland: LikertQuestion[];
  subjects: string[];
  interests: string[];
};

export type DiagnosisAnswers = {
  likert: Record<string, number>;
  subjects: string[];
  interests: string[];
  currentIndex: number;
  startedAt?: number;
};

export type HollandScores = Record<HollandType, number>;

export type RecommendedMajor = {
  majorId: string;
  name: string;
  category: string;
  summary: string;
  score: number;
  reason: string;
};

export type DiagnosisResult = {
  hollandScores: HollandScores;
  topHollandTypes: HollandType[];
  topMajors: RecommendedMajor[];
  /** Map of every major id → adequacy score (0~100). Used by compare/roadmap. */
  allMajorScores?: Record<string, number>;
  selectedSubjects: string[];
  selectedInterests: string[];
  computedAt: number;
};
