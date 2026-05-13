export type CareerTypeAxisDef = {
  key: string;
  labelA: string;
  labelB: string;
  nameA: string;
  nameB: string;
  descA: string;
  descB: string;
};

export type CareerTypeOption = {
  label: string;
  value: string;
};

export type CareerTypeQuestion = {
  id: number;
  axis: string;
  text: string;
  options: [CareerTypeOption, CareerTypeOption];
};

export type RecommendedJob = {
  label: string;
  jobCd: number;
};

export type CareerType = {
  code: string;
  nickname: string;
  tagline: string;
  emoji: string;
  description: string;
  strengths: string[];
  recommendedMajors: string[];
  recommendedJobs: RecommendedJob[];
  famousPeople: string[];
  color: string;
  colorBg: string;
};

export type CareerTypesData = {
  version: string;
  axes: Record<string, CareerTypeAxisDef>;
  questions: CareerTypeQuestion[];
  types: Record<string, CareerType>;
};

export type AxisScores = {
  T: number;
  I: number;
  P: number;
  O: number;
  S: number;
  C: number;
  E: number;
  M: number;
};

export type QuizResult = {
  typeCode: string;
  scores: AxisScores;
};

/** 4축 대결 쌍 */
export const AXIS_PAIRS = [
  { a: "T", b: "I", nameA: "논리형", nameB: "직관형" },
  { a: "P", b: "O", nameA: "실천형", nameB: "탐구형" },
  { a: "S", b: "C", nameA: "독립형", nameB: "협력형" },
  { a: "E", b: "M", nameA: "표현형", nameB: "몰입형" },
] as const;
