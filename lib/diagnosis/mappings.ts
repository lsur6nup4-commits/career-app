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

// ──────────────────────────────────────────────────────────────────────────
// INTEREST_TO_MAJORS
// 관심 분야 → 관련 학과 ID 목록 (hollandTags + keywords 기반 자동 확장)
// 기존 30개 학과 보존 + 신규 122개 학과 추가 (총 152개 커버)
// ──────────────────────────────────────────────────────────────────────────
export const INTEREST_TO_MAJORS: Record<string, string[]> = {
  "IT/소프트웨어": [
    // 기존
    "computer-science",
    "electrical-engineering",
    "industrial-engineering",
    // 신규
    "software",
    "ai-engineering",
    "data-science",
    "cybersecurity",
    "game-engineering",
    "information-communication",
    "systems",
    "mechatronics",
  ],
  "인공지능/데이터": [
    // 기존
    "computer-science",
    "mathematics",
    "industrial-engineering",
    "physics",
    // 신규
    "ai-engineering",
    "data-science",
    "software",
    "statistics",
    "cybersecurity",
    "information-communication",
    "systems",
  ],
  "의료/건강": [
    // 기존
    "medicine",
    "nursing",
    "pharmacy",
    "biomedical-engineering",
    // 신규
    "dentistry",
    "korean-medicine",
    "veterinary",
    "clinical-pathology",
    "radiology",
    "occupational-therapy",
    "physical-therapy",
    "emergency-medical",
    "public-health",
    "health-admin",
  ],
  "바이오/생명과학": [
    // 기존
    "biology",
    "biomedical-engineering",
    "chemistry",
    "pharmacy",
    // 신규
    "bio-engineering",
    "agricultural-engineering",
    "food-engineering",
    "fisheries",
    "animal-science",
    "medicine",
    "nursing",
    "new-materials",
  ],
  "디자인/예술": [
    // 기존
    "design",
    "civil-engineering",
    // 신규
    "visual-design",
    "industrial-design",
    "fashion-design",
    "interior-design",
    "painting-eastern",
    "painting-western",
    "sculpture",
    "ceramic-art",
    "photography",
    "animation",
    "game-graphics",
    "industrial-design-eng",
    "film-tv",
    "theater-film",
  ],
  "콘텐츠/미디어": [
    // 기존
    "media-communication",
    "design",
    "korean-language-lit",
    "english-language-lit",
    // 신규
    "film-tv",
    "animation",
    "game-graphics",
    "broadcasting",
    "advertising",
    "applied-music",
    "theater-film",
    "game-engineering",
    "photography",
  ],
  "금융/경제": [
    // 기존
    "economics",
    "business",
    "accounting",
    "mathematics",
    // 신규
    "trade",
    "international-business",
    "real-estate",
    "statistics",
    "policy-studies",
    "public-administration",
    "industrial-engineering",
  ],
  "마케팅/광고": [
    // 기존
    "business",
    "media-communication",
    "psychology",
    // 신규
    "advertising",
    "broadcasting",
    "tourism",
    "hotel-management",
    "fashion-design",
    "consumer-studies",
    "economics",
  ],
  "교육": [
    // 기존
    "education",
    "korean-language-edu",
    "physical-education",
    "psychology",
    // 신규
    "math-edu",
    "english-edu",
    "social-edu",
    "science-edu",
    "early-childhood-edu",
    "elementary-edu",
    "special-edu",
    "ethics-edu",
    "art-edu",
    "music-edu",
    "technology-edu",
    "home-edu",
    "history-edu",
  ],
  "법/정치": [
    // 기존
    "law",
    "political-science",
    "sociology",
    // 신규
    "public-administration",
    "police-admin",
    "military-studies",
    "north-korea-studies",
    "global-studies",
    "policy-studies",
  ],
  "심리/상담": [
    // 기존
    "psychology",
    "education",
    "sociology",
    // 신규
    "social-welfare",
    "child-studies",
    "family-studies",
    "youth-studies",
    "occupational-therapy",
    "special-edu",
    "consumer-studies",
    "nursing",
  ],
  "환경/에너지": [
    // 기존
    "chemical-engineering",
    "chemistry",
    "biology",
    // 신규
    "environmental",
    "energy",
    "nuclear",
    "earth-science",
    "atmospheric",
    "oceanography",
    "geology",
    "agriculture",
    "forestry",
    "ocean-engineering",
  ],
  "건축/공간": [
    // 기존
    "civil-engineering",
    "design",
    // 신규
    "interior-design",
    "urban-planning-eng",
    "civil-construction",
    "urban-planning-social",
    "real-estate",
    "human-geography",
  ],
  "기계/로봇": [
    // 기존
    "mechanical-engineering",
    "electrical-engineering",
    "industrial-engineering",
    // 신규
    "robotics",
    "mechatronics",
    "automotive",
    "aerospace",
    "naval-architecture",
    "transportation",
    "systems",
  ],
  "화학/소재": [
    // 기존
    "chemistry",
    "chemical-engineering",
    // 신규
    "new-materials",
    "metallurgy",
    "textile",
    "nano",
    "physics",
    "mining",
    "bio-engineering",
  ],
  "언어/문학": [
    // 기존
    "korean-language-lit",
    "english-language-lit",
    "korean-language-edu",
    // 신규
    "french-lit",
    "german-lit",
    "japanese-lit",
    "chinese-lit",
    "russian-lit",
    "spanish-lit",
    "arabic-lit",
    "vietnamese-lit",
    "indian-lit",
    "english-edu",
    "philosophy",
  ],
  "역사/철학": [
    // 기존
    "history",
    "philosophy",
    "sociology",
    // 신규
    "east-asian-history",
    "western-history",
    "archaeology",
    "cultural-heritage",
    "religion-studies",
    "theology",
    "anthropology",
    "history-edu",
    "ethics-edu",
  ],
  "스포츠": [
    // 기존
    "physical-education",
    // 신규
    "sports-science",
    "social-sports",
    "taekwondo",
    "physical-therapy",
  ],
  "사회복지": [
    // 기존
    "nursing",
    "psychology",
    "sociology",
    "education",
    // 신규
    "social-welfare",
    "child-studies",
    "family-studies",
    "youth-studies",
    "occupational-therapy",
    "public-health",
    "special-edu",
  ],
  "창업/경영": [
    // 기존
    "business",
    "industrial-engineering",
    "economics",
    // 신규
    "hotel-management",
    "tourism",
    "trade",
    "international-business",
    "advertising",
    "media-communication",
    "real-estate",
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// SUBJECT_TO_MAJORS
// 고교 선택 과목 → 관련 학과 ID 목록 (hollandTags + keywords 기반 자동 확장)
// 기존 7개 과목 보존 + 신규 학과 122개 추가
// ──────────────────────────────────────────────────────────────────────────
export const SUBJECT_TO_MAJORS: Record<string, string[]> = {
  "국어": [
    // 기존
    "korean-language-lit",
    "korean-language-edu",
    "history",
    "philosophy",
    "law",
    "media-communication",
    // 신규
    "broadcasting",
    "advertising",
    "anthropology",
    "east-asian-history",
    "western-history",
    "cultural-heritage",
    "history-edu",
    "ethics-edu",
    "religion-studies",
    "theology",
  ],
  "영어": [
    // 기존
    "english-language-lit",
    "political-science",
    "media-communication",
    // 신규
    "english-edu",
    "global-studies",
    "international-business",
    "trade",
    "french-lit",
    "german-lit",
    "japanese-lit",
    "chinese-lit",
    "russian-lit",
    "spanish-lit",
    "arabic-lit",
    "vietnamese-lit",
    "broadcasting",
    "north-korea-studies",
  ],
  "수학": [
    // 기존
    "mathematics",
    "physics",
    "computer-science",
    "electrical-engineering",
    "industrial-engineering",
    "economics",
    "accounting",
    // 신규
    "statistics",
    "data-science",
    "software",
    "ai-engineering",
    "information-communication",
    "systems",
    "transportation",
    "aerospace",
    "mechanical-engineering",
    "chemical-engineering",
    "trade",
    "policy-studies",
  ],
  "사회": [
    // 기존
    "sociology",
    "political-science",
    "law",
    "psychology",
    "education",
    "business",
    "history",
    "media-communication",
    // 신규
    "public-administration",
    "social-welfare",
    "child-studies",
    "family-studies",
    "youth-studies",
    "police-admin",
    "military-studies",
    "north-korea-studies",
    "global-studies",
    "consumer-studies",
    "urban-planning-social",
    "policy-studies",
    "advertising",
    "broadcasting",
    "health-admin",
    "tourism",
    "hotel-management",
  ],
  "과학": [
    // 기존
    "medicine",
    "nursing",
    "pharmacy",
    "biology",
    "chemistry",
    "physics",
    "biomedical-engineering",
    "chemical-engineering",
    "mechanical-engineering",
    "electrical-engineering",
    // 신규
    "bio-engineering",
    "ai-engineering",
    "data-science",
    "earth-science",
    "astronomy",
    "statistics",
    "atmospheric",
    "oceanography",
    "geology",
    "agriculture",
    "forestry",
    "horticulture",
    "animal-science",
    "fisheries",
    "food-engineering",
    "environmental",
    "energy",
    "nuclear",
    "new-materials",
    "metallurgy",
    "nano",
    "cybersecurity",
    "robotics",
    "aerospace",
    "dentistry",
    "software",
    "information-communication",
    "agricultural-engineering",
  ],
  "예술": [
    // 기존
    "design",
    "civil-engineering",
    "korean-language-lit",
    "english-language-lit",
    // 신규
    "visual-design",
    "industrial-design",
    "fashion-design",
    "interior-design",
    "painting-eastern",
    "painting-western",
    "sculpture",
    "ceramic-art",
    "photography",
    "film-tv",
    "animation",
    "game-graphics",
    "music-theory",
    "composition",
    "vocal",
    "piano",
    "orchestra",
    "korean-music",
    "applied-music",
    "dance",
    "theater-film",
    "art-edu",
    "music-edu",
    "industrial-design-eng",
  ],
  "체육": [
    // 기존
    "physical-education",
    // 신규
    "sports-science",
    "social-sports",
    "taekwondo",
    "physical-therapy",
    "emergency-medical",
  ],
};
