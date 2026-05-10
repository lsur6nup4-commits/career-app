import type { HollandType } from "@/types/diagnosis";

export const HOLLAND_LABELS: Record<HollandType, string> = {
  R: "현실형",
  I: "탐구형",
  A: "예술형",
  S: "사회형",
  E: "진취형",
  C: "관습형",
};

export const HOLLAND_DESCRIPTIONS: Record<HollandType, string> = {
  R: "직접 손으로 만들고 다루며, 실용적인 결과를 즐기는 유형",
  I: "관찰하고 분석하며 원리를 탐구하는 것을 즐기는 유형",
  A: "창의적이고 자유로우며 자신을 표현하는 것을 즐기는 유형",
  S: "사람과 함께 일하고 돕는 것에서 보람을 느끼는 유형",
  E: "리드하고 설득하며 도전적 목표를 추구하는 유형",
  C: "체계적이고 정확하게 정보를 다루는 것을 즐기는 유형",
};

export const INTEREST_TO_MAJORS: Record<string, string[]> = {
  "IT/소프트웨어": ["computer-science", "electrical-engineering", "industrial-engineering"],
  "인공지능/데이터": ["computer-science", "mathematics", "industrial-engineering", "physics"],
  "의료/건강": ["medicine", "nursing", "pharmacy", "biomedical-engineering"],
  "바이오/생명과학": ["biology", "biomedical-engineering", "chemistry", "pharmacy"],
  "디자인/예술": ["design", "civil-engineering"],
  "콘텐츠/미디어": ["media-communication", "design", "korean-language-lit", "english-language-lit"],
  "금융/경제": ["economics", "business", "accounting", "mathematics"],
  "마케팅/광고": ["business", "media-communication", "psychology"],
  "교육": ["education", "korean-language-edu", "physical-education", "psychology"],
  "법/정치": ["law", "political-science", "sociology"],
  "심리/상담": ["psychology", "education", "sociology"],
  "환경/에너지": ["chemical-engineering", "chemistry", "biology"],
  "건축/공간": ["civil-engineering", "design"],
  "기계/로봇": ["mechanical-engineering", "electrical-engineering", "industrial-engineering"],
  "화학/소재": ["chemistry", "chemical-engineering"],
  "언어/문학": ["korean-language-lit", "english-language-lit", "korean-language-edu"],
  "역사/철학": ["history", "philosophy", "sociology"],
  "스포츠": ["physical-education"],
  "사회복지": ["nursing", "psychology", "sociology", "education"],
  "창업/경영": ["business", "industrial-engineering", "economics"],
};

export const SUBJECT_TO_MAJORS: Record<string, string[]> = {
  "국어": ["korean-language-lit", "korean-language-edu", "history", "philosophy", "law", "media-communication"],
  "영어": ["english-language-lit", "political-science", "media-communication"],
  "수학": ["mathematics", "physics", "computer-science", "electrical-engineering", "industrial-engineering", "economics", "accounting"],
  "사회": ["sociology", "political-science", "law", "psychology", "education", "business", "history", "media-communication"],
  "과학": ["medicine", "nursing", "pharmacy", "biology", "chemistry", "physics", "biomedical-engineering", "chemical-engineering", "mechanical-engineering", "electrical-engineering"],
  "예술": ["design", "civil-engineering", "korean-language-lit", "english-language-lit"],
  "체육": ["physical-education"],
};
