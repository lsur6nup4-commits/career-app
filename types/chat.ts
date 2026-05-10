export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatRequestBody = {
  messages: Array<{ role: ChatRole; content: string }>;
  diagnosisContext?: DiagnosisContext;
};

export type DiagnosisContext = {
  hollandScores: Record<string, number>;
  topHollandTypes: string[];
  selectedSubjects: string[];
  selectedInterests: string[];
  topMajors: Array<{ name: string; score: number; category: string }>;
};

export type SseEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };
