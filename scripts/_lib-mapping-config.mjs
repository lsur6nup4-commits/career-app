/**
 * scripts/_lib-mapping-config.mjs
 *
 * 대학-학과 매핑에 사용되는 정규화 함수와 사전.
 * import-csv-data.mjs (생성) 와 verify-mappings.mjs (검증) 가 공유.
 *
 * ⚠️ 이 파일을 수정할 때는 두 스크립트의 결과가 일치하도록 유의.
 */

// ── 대학명 정규화 ────────────────────────────────────────────────────────
/** 괄호+내용·국립/사립 접두사 제거, 공백 제거 */
export function normUni(name) {
  return name
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/^국립|^사립|^공립/, "")
    .replace(/\s+/g, "")
    .trim();
}

// ── 학과명 정규화 ────────────────────────────────────────────────────────
/** 괄호 내용 제거, suffix 통일, 공백 제거 */
export function normMajor(name) {
  return name
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, "")
    .replace(/(학부|전공|전문학부)$/, "학과")
    .trim();
}

// ── 학과명 매핑 사전 (CSV 학과명 변형 → seed major id) ────────────────
export const MAJOR_NAME_OVERRIDES = {
  // ── 공학계열 ─────────────────────────────────────────────────────────
  "전기공학과": "electrical-engineering",
  "전자공학과": "electrical-engineering",
  "전기전자공학부": "electrical-engineering",
  "반도체공학과": "electrical-engineering",
  "소프트웨어학과": "software",
  "AI학과": "ai-engineering",
  "인공지능공학과": "ai-engineering",
  "빅데이터학과": "data-science",
  "데이터과학과": "data-science",
  "정보보안학과": "cybersecurity",
  "정보보호학과": "cybersecurity",
  "게임공학부": "game-engineering",
  "항공우주공학부": "aerospace",
  "자동차학과": "automotive",
  "스마트자동차학과": "automotive",
  "로봇시스템공학과": "robotics",
  "지능로봇공학과": "robotics",
  "신소재공학부": "new-materials",
  "재료공학과": "new-materials",
  "섬유패션공학과": "textile",
  "환경에너지공학과": "environmental",
  "에너지자원공학과": "energy",
  "원자력및양자공학과": "nuclear",
  "도시계획학과": "urban-planning-eng",
  "도시및지역계획학과": "urban-planning-eng",
  "건설환경공학과": "civil-construction",
  "토목환경공학과": "civil-construction",
  "해양시스템공학과": "ocean-engineering",
  "자원에너지학과": "mining",
  "광산자원공학과": "mining",
  "나노소재공학과": "nano",
  "바이오공학과": "bio-engineering",
  "생물공학과": "bio-engineering",
  "융합기계공학과": "mechatronics",
  "메카트로닉스공학부": "mechatronics",
  "교통시스템공학과": "transportation",
  "농업생명과학과": "agricultural-engineering",
  "식품생명공학과": "food-engineering",
  "식품공학부": "food-engineering",
  "산업경영공학과": "industrial-engineering",
  "산업공학부": "industrial-engineering",
  "제어계측공학과": "mechatronics",
  "시스템반도체공학과": "electrical-engineering",
  "디스플레이공학과": "electrical-engineering",

  // ── 자연계열 ─────────────────────────────────────────────────────────
  "생물학과": "biology",
  "생명과학부": "biology",
  "분자생물학과": "biology",
  "지구환경과학과": "earth-science",
  "지구시스템과학과": "earth-science",
  "지질환경과학과": "geology",
  "해양과학과": "oceanography",
  "천문학과": "astronomy",
  "대기과학부": "atmospheric",
  "산림자원학과": "forestry",
  "산림학과": "forestry",
  "원예생명과학과": "horticulture",
  "원예산업학과": "horticulture",
  "축산학과": "animal-science",
  "동물생산학과": "animal-science",
  "수산학과": "fisheries",
  "해양생명과학과": "fisheries",
  "응용통계학과": "statistics",
  "전산통계학과": "statistics",

  // ── 인문계열 ─────────────────────────────────────────────────────────
  "동양사학부": "east-asian-history",
  "동양사학전공": "east-asian-history",
  "서양사학부": "western-history",
  "문화재보존학과": "cultural-heritage",
  "문화유산학과": "cultural-heritage",
  "인도어과": "indian-lit",
  "인도어학과": "indian-lit",
  "한국어문학과": "korean-language-lit",
  "국문학과": "korean-language-lit",
  "영문학과": "english-language-lit",
  "불문학과": "french-lit",
  "독문학과": "german-lit",
  "일문학과": "japanese-lit",
  "중문학과": "chinese-lit",
  "노어학과": "russian-lit",
  "서어학과": "spanish-lit",

  // ── 사회계열 ─────────────────────────────────────────────────────────
  "북한학부": "north-korea-studies",
  "통일학과": "north-korea-studies",
  "국제학과": "global-studies",
  "국제지역학과": "global-studies",
  "글로벌비즈니스학과": "international-business",
  "국제무역학과": "trade",
  "청소년지도학과": "youth-studies",
  "아동복지학과": "child-studies",
  "가족자원경영학과": "family-studies",

  // ── 교육계열 ─────────────────────────────────────────────────────────
  "국어교육학과": "korean-language-edu",
  "영어교육학과": "english-edu",
  "수학교육학과": "math-edu",
  "사회교육학과": "social-edu",
  "과학교육학과": "science-edu",
  "윤리교육학과": "ethics-edu",
  "역사교육학과": "history-edu",
  "특수교육학과": "special-edu",
  "유아교육학과": "early-childhood-edu",
  "미술교육학과": "art-edu",
  "음악교육학과": "music-edu",
  "기술교육학과": "technology-edu",
  "가정교육학과": "home-edu",

  // ── 의약계열 (정규화 사전: 다양한 변형을 통일된 학과 ID로 매핑) ───
  // 의예/의학 → medicine
  "의예과": "medicine",
  "의학과": "medicine",
  "의과대학": "medicine",
  "의학전공": "medicine",
  "의학부": "medicine",
  // 약학 → pharmacy
  "약학과": "pharmacy",
  "약학대학": "pharmacy",
  "약학전공": "pharmacy",
  "제약학과": "pharmacy",
  "제약학전공": "pharmacy",
  "산업제약학과": "pharmacy",
  // 치의 → dentistry
  "치의예과": "dentistry",
  "치의학과": "dentistry",
  "치과대학": "dentistry",
  // 수의 → veterinary
  "수의예과": "veterinary",
  "수의학과": "veterinary",
  // 한의 → korean-medicine
  "한의예과": "korean-medicine",
  "한의학과": "korean-medicine",
  "한약학과": "korean-medicine",
  // 간호 → nursing
  "간호학과": "nursing",
  "간호대학": "nursing",
  "간호전공": "nursing",
  // 보건 → public-health
  "보건학부": "public-health",
  "보건관리학과": "public-health",
  // 기타 의약계 4년제
  "방사선과": "radiology",
  "방사선학부": "radiology",
  "임상병리과": "clinical-pathology",
  "물리치료과": "physical-therapy",
  "작업치료과": "occupational-therapy",
  "응급구조과": "emergency-medical",

  // ── 예체능계열 ───────────────────────────────────────────────────────
  "시각디자인과": "visual-design",
  "산업디자인과": "industrial-design",
  "패션디자인과": "fashion-design",
  "실내건축학과": "interior-design",
  "인테리어디자인학과": "interior-design",
  "한국화과": "painting-eastern",
  "회화과": "painting-western",
  "서양화과": "painting-western",
  "애니메이션학과": "animation",
  "게임그래픽학과": "game-graphics",
  "연기과": "theater-film",
  "피아노과": "piano",
  "성악과": "vocal",
  "관현악부": "orchestra",
  "국악과": "korean-music",
  "실용음악학과": "applied-music",
  "무용과": "dance",
  "발레과": "dance",
  "태권도과": "taekwondo",
  "생활체육학과": "social-sports",
  "스포츠의학과": "sports-science",
  "스포츠건강관리학과": "sports-science",
};
