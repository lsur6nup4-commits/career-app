// AUTO-GENERATED from seed/majors.json — do not edit manually
// Run: node scripts/gen-major-kw-map.mjs to regenerate
//
// 정제 규칙 (적용됨):
//   - 2자 이하 키워드 제거 (영어 약어 포함)
//   - 10개 이상 학과에 연결된 키워드 제거 (변별력 없음)
//   - 블랙리스트 키워드 제거 (lib/interests/extractor.ts 와 동기화)

export type MajorRef = { id: string; name: string; category: string };

export const MAJOR_KW_MAP: Record<string, MajorRef[]> = {
  "프로그래밍": [
    {
      "id": "computer-science",
      "name": "컴퓨터공학과",
      "category": "공학계열"
    },
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    },
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    },
    {
      "id": "robotics",
      "name": "로봇공학과",
      "category": "공학계열"
    }
  ],
  "알고리즘": [
    {
      "id": "computer-science",
      "name": "컴퓨터공학과",
      "category": "공학계열"
    },
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    }
  ],
  "소프트웨어": [
    {
      "id": "computer-science",
      "name": "컴퓨터공학과",
      "category": "공학계열"
    },
    {
      "id": "information-communication",
      "name": "정보통신공학과",
      "category": "공학계열"
    },
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    }
  ],
  "데이터": [
    {
      "id": "computer-science",
      "name": "컴퓨터공학과",
      "category": "공학계열"
    },
    {
      "id": "industrial-engineering",
      "name": "산업공학과",
      "category": "공학계열"
    },
    {
      "id": "mathematics",
      "name": "수학과",
      "category": "자연계열"
    },
    {
      "id": "policy-studies",
      "name": "정책학과",
      "category": "사회계열"
    },
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    },
    {
      "id": "data-science",
      "name": "데이터사이언스학과",
      "category": "공학계열"
    },
    {
      "id": "statistics",
      "name": "통계학과",
      "category": "자연계열"
    },
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "반도체": [
    {
      "id": "electrical-engineering",
      "name": "전기전자공학과",
      "category": "공학계열"
    },
    {
      "id": "physics",
      "name": "물리학과",
      "category": "자연계열"
    },
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    },
    {
      "id": "nano",
      "name": "나노공학과",
      "category": "공학계열"
    }
  ],
  "임베디드": [
    {
      "id": "electrical-engineering",
      "name": "전기전자공학과",
      "category": "공학계열"
    },
    {
      "id": "mechatronics",
      "name": "메카트로닉스공학과",
      "category": "공학계열"
    }
  ],
  "CAD": [
    {
      "id": "mechanical-engineering",
      "name": "기계공학과",
      "category": "공학계열"
    }
  ],
  "자동차": [
    {
      "id": "mechanical-engineering",
      "name": "기계공학과",
      "category": "공학계열"
    },
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    }
  ],
  "에너지": [
    {
      "id": "mechanical-engineering",
      "name": "기계공학과",
      "category": "공학계열"
    },
    {
      "id": "chemical-engineering",
      "name": "화학공학과",
      "category": "공학계열"
    },
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "반응공학": [
    {
      "id": "chemical-engineering",
      "name": "화학공학과",
      "category": "공학계열"
    }
  ],
  "신소재": [
    {
      "id": "chemical-engineering",
      "name": "화학공학과",
      "category": "공학계열"
    },
    {
      "id": "chemistry",
      "name": "화학과",
      "category": "자연계열"
    },
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    }
  ],
  "바이오": [
    {
      "id": "chemical-engineering",
      "name": "화학공학과",
      "category": "공학계열"
    },
    {
      "id": "biomedical-engineering",
      "name": "의공학과",
      "category": "공학계열"
    },
    {
      "id": "biology",
      "name": "생명과학과",
      "category": "자연계열"
    },
    {
      "id": "food-engineering",
      "name": "식품공학과",
      "category": "공학계열"
    },
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "디자인": [
    {
      "id": "civil-engineering",
      "name": "건축학과",
      "category": "공학계열"
    },
    {
      "id": "industrial-design",
      "name": "산업디자인학과",
      "category": "예체능계열"
    }
  ],
  "최적화": [
    {
      "id": "industrial-engineering",
      "name": "산업공학과",
      "category": "공학계열"
    },
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "경영과학": [
    {
      "id": "industrial-engineering",
      "name": "산업공학과",
      "category": "공학계열"
    }
  ],
  "의료기기": [
    {
      "id": "biomedical-engineering",
      "name": "의공학과",
      "category": "공학계열"
    }
  ],
  "헬스케어": [
    {
      "id": "biomedical-engineering",
      "name": "의공학과",
      "category": "공학계열"
    }
  ],
  "기초의학": [
    {
      "id": "medicine",
      "name": "의예과",
      "category": "의약계열"
    }
  ],
  "간호사": [
    {
      "id": "nursing",
      "name": "간호학과",
      "category": "의약계열"
    }
  ],
  "공중보건": [
    {
      "id": "nursing",
      "name": "간호학과",
      "category": "의약계열"
    },
    {
      "id": "health-admin",
      "name": "보건행정학과",
      "category": "사회계열"
    },
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "마케팅": [
    {
      "id": "business",
      "name": "경영학과",
      "category": "사회계열"
    },
    {
      "id": "tourism",
      "name": "관광경영학과",
      "category": "사회계열"
    },
    {
      "id": "consumer-studies",
      "name": "소비자학과",
      "category": "사회계열"
    }
  ],
  "거시경제": [
    {
      "id": "economics",
      "name": "경제학과",
      "category": "사회계열"
    }
  ],
  "회계사": [
    {
      "id": "accounting",
      "name": "회계학과",
      "category": "사회계열"
    }
  ],
  "CPA": [
    {
      "id": "accounting",
      "name": "회계학과",
      "category": "사회계열"
    }
  ],
  "변호사": [
    {
      "id": "law",
      "name": "법학과",
      "category": "사회계열"
    }
  ],
  "로스쿨": [
    {
      "id": "law",
      "name": "법학과",
      "category": "사회계열"
    }
  ],
  "국제관계": [
    {
      "id": "political-science",
      "name": "정치외교학과",
      "category": "사회계열"
    },
    {
      "id": "global-studies",
      "name": "글로벌학과",
      "category": "사회계열"
    }
  ],
  "사회구조": [
    {
      "id": "sociology",
      "name": "사회학과",
      "category": "사회계열"
    }
  ],
  "평생교육": [
    {
      "id": "education",
      "name": "교육학과",
      "category": "교육계열"
    }
  ],
  "통번역": [
    {
      "id": "english-language-lit",
      "name": "영어영문학과",
      "category": "인문계열"
    },
    {
      "id": "french-lit",
      "name": "불어불문학과",
      "category": "인문계열"
    },
    {
      "id": "japanese-lit",
      "name": "일어일문학과",
      "category": "인문계열"
    },
    {
      "id": "chinese-lit",
      "name": "중어중문학과",
      "category": "인문계열"
    },
    {
      "id": "russian-lit",
      "name": "노어노문학과",
      "category": "인문계열"
    },
    {
      "id": "spanish-lit",
      "name": "서어서문학과",
      "category": "인문계열"
    },
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    },
    {
      "id": "vietnamese-lit",
      "name": "베트남어과",
      "category": "인문계열"
    },
    {
      "id": "indian-lit",
      "name": "인도학과",
      "category": "인문계열"
    }
  ],
  "영미문화": [
    {
      "id": "english-language-lit",
      "name": "영어영문학과",
      "category": "인문계열"
    }
  ],
  "언어학": [
    {
      "id": "english-language-lit",
      "name": "영어영문학과",
      "category": "인문계열"
    }
  ],
  "국어학": [
    {
      "id": "korean-language-lit",
      "name": "국어국문학과",
      "category": "인문계열"
    }
  ],
  "콘텐츠": [
    {
      "id": "korean-language-lit",
      "name": "국어국문학과",
      "category": "인문계열"
    },
    {
      "id": "media-communication",
      "name": "미디어커뮤니케이션학과",
      "category": "사회계열"
    },
    {
      "id": "japanese-lit",
      "name": "일어일문학과",
      "category": "인문계열"
    },
    {
      "id": "advertising",
      "name": "광고홍보학과",
      "category": "사회계열"
    },
    {
      "id": "animation",
      "name": "만화애니메이션학과",
      "category": "예체능계열"
    }
  ],
  "글쓰기": [
    {
      "id": "korean-language-lit",
      "name": "국어국문학과",
      "category": "인문계열"
    }
  ],
  "고고학": [
    {
      "id": "history",
      "name": "사학과",
      "category": "인문계열"
    },
    {
      "id": "archaeology",
      "name": "고고학과",
      "category": "인문계열"
    }
  ],
  "박물관": [
    {
      "id": "history",
      "name": "사학과",
      "category": "인문계열"
    },
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    },
    {
      "id": "western-history",
      "name": "서양사학과",
      "category": "인문계열"
    },
    {
      "id": "cultural-heritage",
      "name": "문화재학과",
      "category": "인문계열"
    }
  ],
  "비판적사고": [
    {
      "id": "philosophy",
      "name": "철학과",
      "category": "인문계열"
    }
  ],
  "분자생물학": [
    {
      "id": "biology",
      "name": "생명과학과",
      "category": "자연계열"
    }
  ],
  "유기화학": [
    {
      "id": "chemistry",
      "name": "화학과",
      "category": "자연계열"
    }
  ],
  "분석화학": [
    {
      "id": "chemistry",
      "name": "화학과",
      "category": "자연계열"
    }
  ],
  "양자역학": [
    {
      "id": "physics",
      "name": "물리학과",
      "category": "자연계열"
    }
  ],
  "전자기학": [
    {
      "id": "physics",
      "name": "물리학과",
      "category": "자연계열"
    }
  ],
  "이론물리": [
    {
      "id": "physics",
      "name": "물리학과",
      "category": "자연계열"
    }
  ],
  "그래픽": [
    {
      "id": "design",
      "name": "디자인학과",
      "category": "예체능계열"
    }
  ],
  "브랜드": [
    {
      "id": "design",
      "name": "디자인학과",
      "category": "예체능계열"
    },
    {
      "id": "hotel-management",
      "name": "호텔경영학과",
      "category": "사회계열"
    },
    {
      "id": "advertising",
      "name": "광고홍보학과",
      "category": "사회계열"
    },
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    },
    {
      "id": "fashion-design",
      "name": "패션디자인학과",
      "category": "예체능계열"
    }
  ],
  "산업디자인": [
    {
      "id": "design",
      "name": "디자인학과",
      "category": "예체능계열"
    },
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "포트폴리오": [
    {
      "id": "design",
      "name": "디자인학과",
      "category": "예체능계열"
    },
    {
      "id": "photography",
      "name": "사진학과",
      "category": "예체능계열"
    }
  ],
  "미디어": [
    {
      "id": "media-communication",
      "name": "미디어커뮤니케이션학과",
      "category": "사회계열"
    },
    {
      "id": "advertising",
      "name": "광고홍보학과",
      "category": "사회계열"
    },
    {
      "id": "broadcasting",
      "name": "신문방송학과",
      "category": "사회계열"
    },
    {
      "id": "photography",
      "name": "사진학과",
      "category": "예체능계열"
    }
  ],
  "저널리즘": [
    {
      "id": "media-communication",
      "name": "미디어커뮤니케이션학과",
      "category": "사회계열"
    },
    {
      "id": "broadcasting",
      "name": "신문방송학과",
      "category": "사회계열"
    }
  ],
  "스포츠": [
    {
      "id": "physical-education",
      "name": "체육교육과",
      "category": "교육계열"
    },
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "운동과학": [
    {
      "id": "physical-education",
      "name": "체육교육과",
      "category": "교육계열"
    },
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "프랑스어": [
    {
      "id": "french-lit",
      "name": "불어불문학과",
      "category": "인문계열"
    }
  ],
  "독일어": [
    {
      "id": "german-lit",
      "name": "독어독문학과",
      "category": "인문계열"
    }
  ],
  "일본어": [
    {
      "id": "japanese-lit",
      "name": "일어일문학과",
      "category": "인문계열"
    }
  ],
  "중국어": [
    {
      "id": "chinese-lit",
      "name": "중어중문학과",
      "category": "인문계열"
    }
  ],
  "동양사상": [
    {
      "id": "chinese-lit",
      "name": "중어중문학과",
      "category": "인문계열"
    }
  ],
  "러시아어": [
    {
      "id": "russian-lit",
      "name": "노어노문학과",
      "category": "인문계열"
    }
  ],
  "유라시아": [
    {
      "id": "russian-lit",
      "name": "노어노문학과",
      "category": "인문계열"
    }
  ],
  "슬라브어": [
    {
      "id": "russian-lit",
      "name": "노어노문학과",
      "category": "인문계열"
    }
  ],
  "러시아문화": [
    {
      "id": "russian-lit",
      "name": "노어노문학과",
      "category": "인문계열"
    }
  ],
  "문화교류": [
    {
      "id": "russian-lit",
      "name": "노어노문학과",
      "category": "인문계열"
    }
  ],
  "스페인어": [
    {
      "id": "spanish-lit",
      "name": "서어서문학과",
      "category": "인문계열"
    }
  ],
  "라틴아메리카": [
    {
      "id": "spanish-lit",
      "name": "서어서문학과",
      "category": "인문계열"
    }
  ],
  "포르투갈어": [
    {
      "id": "spanish-lit",
      "name": "서어서문학과",
      "category": "인문계열"
    }
  ],
  "스페인문화": [
    {
      "id": "spanish-lit",
      "name": "서어서문학과",
      "category": "인문계열"
    }
  ],
  "중남미": [
    {
      "id": "spanish-lit",
      "name": "서어서문학과",
      "category": "인문계열"
    }
  ],
  "아랍어": [
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    }
  ],
  "이슬람": [
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    },
    {
      "id": "religion-studies",
      "name": "종교학과",
      "category": "인문계열"
    }
  ],
  "아라비아어": [
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    }
  ],
  "걸프문화": [
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    }
  ],
  "이슬람문화": [
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    }
  ],
  "중동학": [
    {
      "id": "arabic-lit",
      "name": "아랍어과",
      "category": "인문계열"
    }
  ],
  "베트남어": [
    {
      "id": "vietnamese-lit",
      "name": "베트남어과",
      "category": "인문계열"
    }
  ],
  "동남아": [
    {
      "id": "vietnamese-lit",
      "name": "베트남어과",
      "category": "인문계열"
    }
  ],
  "베트남문화": [
    {
      "id": "vietnamese-lit",
      "name": "베트남어과",
      "category": "인문계열"
    }
  ],
  "아세안": [
    {
      "id": "vietnamese-lit",
      "name": "베트남어과",
      "category": "인문계열"
    }
  ],
  "동남아시아": [
    {
      "id": "vietnamese-lit",
      "name": "베트남어과",
      "category": "인문계열"
    }
  ],
  "힌디어": [
    {
      "id": "indian-lit",
      "name": "인도학과",
      "category": "인문계열"
    }
  ],
  "산스크리트어": [
    {
      "id": "indian-lit",
      "name": "인도학과",
      "category": "인문계열"
    }
  ],
  "인도문화": [
    {
      "id": "indian-lit",
      "name": "인도학과",
      "category": "인문계열"
    }
  ],
  "아시아": [
    {
      "id": "indian-lit",
      "name": "인도학과",
      "category": "인문계열"
    }
  ],
  "동양사": [
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    }
  ],
  "중국사": [
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    }
  ],
  "아시아사": [
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    }
  ],
  "한국사": [
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    },
    {
      "id": "history-edu",
      "name": "역사교육과",
      "category": "교육계열"
    }
  ],
  "역사연구": [
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    },
    {
      "id": "western-history",
      "name": "서양사학과",
      "category": "인문계열"
    }
  ],
  "고문서": [
    {
      "id": "east-asian-history",
      "name": "동양사학과",
      "category": "인문계열"
    }
  ],
  "서양사": [
    {
      "id": "western-history",
      "name": "서양사학과",
      "category": "인문계열"
    }
  ],
  "미국사": [
    {
      "id": "western-history",
      "name": "서양사학과",
      "category": "인문계열"
    }
  ],
  "고대사": [
    {
      "id": "western-history",
      "name": "서양사학과",
      "category": "인문계열"
    }
  ],
  "중세사": [
    {
      "id": "western-history",
      "name": "서양사학과",
      "category": "인문계열"
    }
  ],
  "문화재": [
    {
      "id": "archaeology",
      "name": "고고학과",
      "category": "인문계열"
    },
    {
      "id": "cultural-heritage",
      "name": "문화재학과",
      "category": "인문계열"
    }
  ],
  "기독교": [
    {
      "id": "religion-studies",
      "name": "종교학과",
      "category": "인문계열"
    },
    {
      "id": "theology",
      "name": "신학과",
      "category": "인문계열"
    }
  ],
  "종교사": [
    {
      "id": "religion-studies",
      "name": "종교학과",
      "category": "인문계열"
    }
  ],
  "기독교교육": [
    {
      "id": "theology",
      "name": "신학과",
      "category": "인문계열"
    }
  ],
  "인류학": [
    {
      "id": "anthropology",
      "name": "문화인류학과",
      "category": "인문계열"
    }
  ],
  "민족지": [
    {
      "id": "anthropology",
      "name": "문화인류학과",
      "category": "인문계열"
    }
  ],
  "현장연구": [
    {
      "id": "anthropology",
      "name": "문화인류학과",
      "category": "인문계열"
    }
  ],
  "다문화": [
    {
      "id": "anthropology",
      "name": "문화인류학과",
      "category": "인문계열"
    },
    {
      "id": "global-studies",
      "name": "글로벌학과",
      "category": "사회계열"
    }
  ],
  "사회조사": [
    {
      "id": "anthropology",
      "name": "문화인류학과",
      "category": "인문계열"
    }
  ],
  "공무원": [
    {
      "id": "public-administration",
      "name": "행정학과",
      "category": "사회계열"
    },
    {
      "id": "police-admin",
      "name": "경찰행정학과",
      "category": "사회계열"
    }
  ],
  "지방행정": [
    {
      "id": "public-administration",
      "name": "행정학과",
      "category": "사회계열"
    }
  ],
  "거버넌스": [
    {
      "id": "public-administration",
      "name": "행정학과",
      "category": "사회계열"
    },
    {
      "id": "policy-studies",
      "name": "정책학과",
      "category": "사회계열"
    }
  ],
  "조직관리": [
    {
      "id": "public-administration",
      "name": "행정학과",
      "category": "사회계열"
    }
  ],
  "수출입": [
    {
      "id": "trade",
      "name": "무역학과",
      "category": "사회계열"
    }
  ],
  "국제경영": [
    {
      "id": "trade",
      "name": "무역학과",
      "category": "사회계열"
    },
    {
      "id": "international-business",
      "name": "국제통상학과",
      "category": "사회계열"
    }
  ],
  "무역실무": [
    {
      "id": "trade",
      "name": "무역학과",
      "category": "사회계열"
    }
  ],
  "다국적": [
    {
      "id": "international-business",
      "name": "국제통상학과",
      "category": "사회계열"
    }
  ],
  "FTA": [
    {
      "id": "international-business",
      "name": "국제통상학과",
      "category": "사회계열"
    }
  ],
  "국제법": [
    {
      "id": "international-business",
      "name": "국제통상학과",
      "category": "사회계열"
    }
  ],
  "글로벌경영": [
    {
      "id": "international-business",
      "name": "국제통상학과",
      "category": "사회계열"
    }
  ],
  "서비스": [
    {
      "id": "hotel-management",
      "name": "호텔경영학과",
      "category": "사회계열"
    }
  ],
  "환대산업": [
    {
      "id": "hotel-management",
      "name": "호텔경영학과",
      "category": "사회계열"
    }
  ],
  "서비스경영": [
    {
      "id": "hotel-management",
      "name": "호텔경영학과",
      "category": "사회계열"
    }
  ],
  "문화관광": [
    {
      "id": "tourism",
      "name": "관광경영학과",
      "category": "사회계열"
    }
  ],
  "리조트": [
    {
      "id": "tourism",
      "name": "관광경영학과",
      "category": "사회계열"
    }
  ],
  "이벤트": [
    {
      "id": "tourism",
      "name": "관광경영학과",
      "category": "사회계열"
    }
  ],
  "관광자원": [
    {
      "id": "tourism",
      "name": "관광경영학과",
      "category": "사회계열"
    }
  ],
  "부동산": [
    {
      "id": "real-estate",
      "name": "부동산학과",
      "category": "사회계열"
    }
  ],
  "감정평가": [
    {
      "id": "real-estate",
      "name": "부동산학과",
      "category": "사회계열"
    }
  ],
  "도시정책": [
    {
      "id": "real-estate",
      "name": "부동산학과",
      "category": "사회계열"
    }
  ],
  "자산관리": [
    {
      "id": "real-estate",
      "name": "부동산학과",
      "category": "사회계열"
    }
  ],
  "디지털 마케팅": [
    {
      "id": "advertising",
      "name": "광고홍보학과",
      "category": "사회계열"
    }
  ],
  "SNS": [
    {
      "id": "advertising",
      "name": "광고홍보학과",
      "category": "사회계열"
    }
  ],
  "캠페인": [
    {
      "id": "advertising",
      "name": "광고홍보학과",
      "category": "사회계열"
    }
  ],
  "사회복지": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "노인복지": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "아동복지": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "장애인": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "자원봉사": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "사회서비스": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "복지관": [
    {
      "id": "social-welfare",
      "name": "사회복지학과",
      "category": "사회계열"
    }
  ],
  "어린이집": [
    {
      "id": "child-studies",
      "name": "아동학과",
      "category": "사회계열"
    }
  ],
  "발달심리": [
    {
      "id": "child-studies",
      "name": "아동학과",
      "category": "사회계열"
    }
  ],
  "지역사회": [
    {
      "id": "family-studies",
      "name": "가족학과",
      "category": "사회계열"
    },
    {
      "id": "social-sports",
      "name": "사회체육학과",
      "category": "예체능계열"
    }
  ],
  "가족복지": [
    {
      "id": "family-studies",
      "name": "가족학과",
      "category": "사회계열"
    }
  ],
  "청소년": [
    {
      "id": "youth-studies",
      "name": "청소년학과",
      "category": "사회계열"
    }
  ],
  "지도사": [
    {
      "id": "youth-studies",
      "name": "청소년학과",
      "category": "사회계열"
    }
  ],
  "상담사": [
    {
      "id": "youth-studies",
      "name": "청소년학과",
      "category": "사회계열"
    }
  ],
  "공공정책": [
    {
      "id": "policy-studies",
      "name": "정책학과",
      "category": "사회계열"
    }
  ],
  "뉴미디어": [
    {
      "id": "broadcasting",
      "name": "신문방송학과",
      "category": "사회계열"
    }
  ],
  "방송연출": [
    {
      "id": "broadcasting",
      "name": "신문방송학과",
      "category": "사회계열"
    }
  ],
  "범죄학": [
    {
      "id": "police-admin",
      "name": "경찰행정학과",
      "category": "사회계열"
    }
  ],
  "형사정책": [
    {
      "id": "police-admin",
      "name": "경찰행정학과",
      "category": "사회계열"
    }
  ],
  "범죄예방": [
    {
      "id": "police-admin",
      "name": "경찰행정학과",
      "category": "사회계열"
    }
  ],
  "무기체계": [
    {
      "id": "military-studies",
      "name": "군사학과",
      "category": "사회계열"
    }
  ],
  "리더십": [
    {
      "id": "military-studies",
      "name": "군사학과",
      "category": "사회계열"
    }
  ],
  "안보학": [
    {
      "id": "military-studies",
      "name": "군사학과",
      "category": "사회계열"
    }
  ],
  "의료 경영": [
    {
      "id": "health-admin",
      "name": "보건행정학과",
      "category": "사회계열"
    }
  ],
  "의료정보": [
    {
      "id": "health-admin",
      "name": "보건행정학과",
      "category": "사회계열"
    }
  ],
  "의료기관": [
    {
      "id": "health-admin",
      "name": "보건행정학과",
      "category": "사회계열"
    }
  ],
  "지방자치": [
    {
      "id": "urban-planning-social",
      "name": "도시행정학과",
      "category": "사회계열"
    }
  ],
  "지역개발": [
    {
      "id": "urban-planning-social",
      "name": "도시행정학과",
      "category": "사회계열"
    }
  ],
  "도시계획": [
    {
      "id": "urban-planning-social",
      "name": "도시행정학과",
      "category": "사회계열"
    },
    {
      "id": "urban-planning-eng",
      "name": "도시공학과",
      "category": "공학계열"
    }
  ],
  "스마트시티": [
    {
      "id": "urban-planning-social",
      "name": "도시행정학과",
      "category": "사회계열"
    },
    {
      "id": "urban-planning-eng",
      "name": "도시공학과",
      "category": "공학계열"
    }
  ],
  "GIS": [
    {
      "id": "human-geography",
      "name": "지리학과",
      "category": "사회계열"
    },
    {
      "id": "urban-planning-eng",
      "name": "도시공학과",
      "category": "공학계열"
    }
  ],
  "원격탐사": [
    {
      "id": "human-geography",
      "name": "지리학과",
      "category": "사회계열"
    }
  ],
  "지역분석": [
    {
      "id": "human-geography",
      "name": "지리학과",
      "category": "사회계열"
    }
  ],
  "지역연구": [
    {
      "id": "global-studies",
      "name": "글로벌학과",
      "category": "사회계열"
    }
  ],
  "외국어": [
    {
      "id": "global-studies",
      "name": "글로벌학과",
      "category": "사회계열"
    }
  ],
  "국제기구": [
    {
      "id": "global-studies",
      "name": "글로벌학과",
      "category": "사회계열"
    }
  ],
  "한반도": [
    {
      "id": "north-korea-studies",
      "name": "북한학과",
      "category": "사회계열"
    }
  ],
  "이산가족": [
    {
      "id": "north-korea-studies",
      "name": "북한학과",
      "category": "사회계열"
    }
  ],
  "통일정책": [
    {
      "id": "north-korea-studies",
      "name": "북한학과",
      "category": "사회계열"
    }
  ],
  "소비자": [
    {
      "id": "consumer-studies",
      "name": "소비자학과",
      "category": "사회계열"
    }
  ],
  "트렌드": [
    {
      "id": "consumer-studies",
      "name": "소비자학과",
      "category": "사회계열"
    },
    {
      "id": "fashion-design",
      "name": "패션디자인학과",
      "category": "예체능계열"
    }
  ],
  "소비행동": [
    {
      "id": "consumer-studies",
      "name": "소비자학과",
      "category": "사회계열"
    }
  ],
  "생활과학": [
    {
      "id": "consumer-studies",
      "name": "소비자학과",
      "category": "사회계열"
    },
    {
      "id": "home-edu",
      "name": "가정교육과",
      "category": "교육계열"
    }
  ],
  "중학교": [
    {
      "id": "math-edu",
      "name": "수학교육과",
      "category": "교육계열"
    }
  ],
  "고등학교": [
    {
      "id": "math-edu",
      "name": "수학교육과",
      "category": "교육계열"
    }
  ],
  "수업설계": [
    {
      "id": "math-edu",
      "name": "수학교육과",
      "category": "교육계열"
    },
    {
      "id": "english-edu",
      "name": "영어교육과",
      "category": "교육계열"
    }
  ],
  "학생지도": [
    {
      "id": "math-edu",
      "name": "수학교육과",
      "category": "교육계열"
    }
  ],
  "외국어교육": [
    {
      "id": "english-edu",
      "name": "영어교육과",
      "category": "교육계열"
    }
  ],
  "학교현장": [
    {
      "id": "english-edu",
      "name": "영어교육과",
      "category": "교육계열"
    },
    {
      "id": "social-edu",
      "name": "사회교육과",
      "category": "교육계열"
    },
    {
      "id": "science-edu",
      "name": "과학교육과",
      "category": "교육계열"
    }
  ],
  "원어민": [
    {
      "id": "english-edu",
      "name": "영어교육과",
      "category": "교육계열"
    }
  ],
  "역사교육": [
    {
      "id": "social-edu",
      "name": "사회교육과",
      "category": "교육계열"
    }
  ],
  "지리교육": [
    {
      "id": "social-edu",
      "name": "사회교육과",
      "category": "교육계열"
    }
  ],
  "물리교육": [
    {
      "id": "science-edu",
      "name": "과학교육과",
      "category": "교육계열"
    }
  ],
  "화학교육": [
    {
      "id": "science-edu",
      "name": "과학교육과",
      "category": "교육계열"
    }
  ],
  "생물교육": [
    {
      "id": "science-edu",
      "name": "과학교육과",
      "category": "교육계열"
    }
  ],
  "유치원": [
    {
      "id": "early-childhood-edu",
      "name": "유아교육과",
      "category": "교육계열"
    }
  ],
  "교육환경": [
    {
      "id": "early-childhood-edu",
      "name": "유아교육과",
      "category": "교육계열"
    }
  ],
  "유아교육": [
    {
      "id": "early-childhood-edu",
      "name": "유아교육과",
      "category": "교육계열"
    }
  ],
  "교육과정": [
    {
      "id": "elementary-edu",
      "name": "초등교육과",
      "category": "교육계열"
    }
  ],
  "특수교육": [
    {
      "id": "special-edu",
      "name": "특수교육과",
      "category": "교육계열"
    }
  ],
  "통합교육": [
    {
      "id": "special-edu",
      "name": "특수교육과",
      "category": "교육계열"
    }
  ],
  "언어치료": [
    {
      "id": "special-edu",
      "name": "특수교육과",
      "category": "교육계열"
    }
  ],
  "학습장애": [
    {
      "id": "special-edu",
      "name": "특수교육과",
      "category": "교육계열"
    }
  ],
  "통합학급": [
    {
      "id": "special-edu",
      "name": "특수교육과",
      "category": "교육계열"
    }
  ],
  "보조공학": [
    {
      "id": "special-edu",
      "name": "특수교육과",
      "category": "교육계열"
    }
  ],
  "인성교육": [
    {
      "id": "ethics-edu",
      "name": "윤리교육과",
      "category": "교육계열"
    }
  ],
  "가치관": [
    {
      "id": "ethics-edu",
      "name": "윤리교육과",
      "category": "교육계열"
    }
  ],
  "도덕교육": [
    {
      "id": "ethics-edu",
      "name": "윤리교육과",
      "category": "교육계열"
    }
  ],
  "생활지도": [
    {
      "id": "ethics-edu",
      "name": "윤리교육과",
      "category": "교육계열"
    }
  ],
  "디자인교육": [
    {
      "id": "art-edu",
      "name": "미술교육과",
      "category": "교육계열"
    }
  ],
  "예술교육": [
    {
      "id": "art-edu",
      "name": "미술교육과",
      "category": "교육계열"
    }
  ],
  "미술치료": [
    {
      "id": "art-edu",
      "name": "미술교육과",
      "category": "교육계열"
    }
  ],
  "피아노": [
    {
      "id": "music-edu",
      "name": "음악교육과",
      "category": "교육계열"
    },
    {
      "id": "piano",
      "name": "피아노학과",
      "category": "예체능계열"
    }
  ],
  "악기교육": [
    {
      "id": "music-edu",
      "name": "음악교육과",
      "category": "교육계열"
    }
  ],
  "음악감상": [
    {
      "id": "music-edu",
      "name": "음악교육과",
      "category": "교육계열"
    },
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "공학교육": [
    {
      "id": "technology-edu",
      "name": "기술교육과",
      "category": "교육계열"
    }
  ],
  "직업교육": [
    {
      "id": "technology-edu",
      "name": "기술교육과",
      "category": "교육계열"
    }
  ],
  "메이커": [
    {
      "id": "technology-edu",
      "name": "기술교육과",
      "category": "교육계열"
    }
  ],
  "요리교육": [
    {
      "id": "home-edu",
      "name": "가정교육과",
      "category": "교육계열"
    }
  ],
  "패션교육": [
    {
      "id": "home-edu",
      "name": "가정교육과",
      "category": "교육계열"
    }
  ],
  "가정경제": [
    {
      "id": "home-edu",
      "name": "가정교육과",
      "category": "교육계열"
    }
  ],
  "식생활": [
    {
      "id": "home-edu",
      "name": "가정교육과",
      "category": "교육계열"
    }
  ],
  "세계사": [
    {
      "id": "history-edu",
      "name": "역사교육과",
      "category": "교육계열"
    }
  ],
  "역사문화": [
    {
      "id": "history-edu",
      "name": "역사교육과",
      "category": "교육계열"
    }
  ],
  "네트워크": [
    {
      "id": "information-communication",
      "name": "정보통신공학과",
      "category": "공학계열"
    }
  ],
  "신호처리": [
    {
      "id": "information-communication",
      "name": "정보통신공학과",
      "category": "공학계열"
    }
  ],
  "무선통신": [
    {
      "id": "information-communication",
      "name": "정보통신공학과",
      "category": "공학계열"
    }
  ],
  "인터넷": [
    {
      "id": "information-communication",
      "name": "정보통신공학과",
      "category": "공학계열"
    }
  ],
  "IoT": [
    {
      "id": "information-communication",
      "name": "정보통신공학과",
      "category": "공학계열"
    }
  ],
  "DevOps": [
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    }
  ],
  "클라우드": [
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    }
  ],
  "테스팅": [
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    }
  ],
  "아키텍처": [
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    }
  ],
  "오픈소스": [
    {
      "id": "software",
      "name": "소프트웨어공학과",
      "category": "공학계열"
    }
  ],
  "딥러닝": [
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    }
  ],
  "NLP": [
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    }
  ],
  "머신러닝": [
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    },
    {
      "id": "data-science",
      "name": "데이터사이언스학과",
      "category": "공학계열"
    }
  ],
  "컴퓨터비전": [
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    }
  ],
  "강화학습": [
    {
      "id": "ai-engineering",
      "name": "인공지능학과",
      "category": "공학계열"
    }
  ],
  "빅데이터": [
    {
      "id": "data-science",
      "name": "데이터사이언스학과",
      "category": "공학계열"
    },
    {
      "id": "statistics",
      "name": "통계학과",
      "category": "자연계열"
    }
  ],
  "시각화": [
    {
      "id": "data-science",
      "name": "데이터사이언스학과",
      "category": "공학계열"
    }
  ],
  "파이썬": [
    {
      "id": "data-science",
      "name": "데이터사이언스학과",
      "category": "공학계열"
    }
  ],
  "R언어": [
    {
      "id": "data-science",
      "name": "데이터사이언스학과",
      "category": "공학계열"
    }
  ],
  "포렌식": [
    {
      "id": "cybersecurity",
      "name": "사이버보안학과",
      "category": "공학계열"
    }
  ],
  "네트워크보안": [
    {
      "id": "cybersecurity",
      "name": "사이버보안학과",
      "category": "공학계열"
    }
  ],
  "취약점": [
    {
      "id": "cybersecurity",
      "name": "사이버보안학과",
      "category": "공학계열"
    }
  ],
  "개인정보보호": [
    {
      "id": "cybersecurity",
      "name": "사이버보안학과",
      "category": "공학계열"
    }
  ],
  "침해대응": [
    {
      "id": "cybersecurity",
      "name": "사이버보안학과",
      "category": "공학계열"
    }
  ],
  "그래픽스": [
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    }
  ],
  "유니티": [
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    },
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "언리얼": [
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    }
  ],
  "렌더링": [
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    },
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "물리엔진": [
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    }
  ],
  "게임개발": [
    {
      "id": "game-engineering",
      "name": "게임공학과",
      "category": "공학계열"
    }
  ],
  "비행기": [
    {
      "id": "aerospace",
      "name": "항공우주공학과",
      "category": "공학계열"
    }
  ],
  "유체역학": [
    {
      "id": "aerospace",
      "name": "항공우주공학과",
      "category": "공학계열"
    },
    {
      "id": "naval-architecture",
      "name": "조선해양공학과",
      "category": "공학계열"
    }
  ],
  "선박설계": [
    {
      "id": "naval-architecture",
      "name": "조선해양공학과",
      "category": "공학계열"
    }
  ],
  "구조역학": [
    {
      "id": "naval-architecture",
      "name": "조선해양공학과",
      "category": "공학계열"
    }
  ],
  "해양구조물": [
    {
      "id": "naval-architecture",
      "name": "조선해양공학과",
      "category": "공학계열"
    },
    {
      "id": "ocean-engineering",
      "name": "해양공학과",
      "category": "공학계열"
    }
  ],
  "전기차": [
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    }
  ],
  "자율주행": [
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    }
  ],
  "제어시스템": [
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    }
  ],
  "내연기관": [
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    }
  ],
  "배터리": [
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    },
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    },
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "모빌리티": [
    {
      "id": "automotive",
      "name": "자동차공학과",
      "category": "공학계열"
    }
  ],
  "자동화": [
    {
      "id": "robotics",
      "name": "로봇공학과",
      "category": "공학계열"
    },
    {
      "id": "mechatronics",
      "name": "메카트로닉스공학과",
      "category": "공학계열"
    }
  ],
  "기구학": [
    {
      "id": "robotics",
      "name": "로봇공학과",
      "category": "공학계열"
    }
  ],
  "제조로봇": [
    {
      "id": "robotics",
      "name": "로봇공학과",
      "category": "공학계열"
    }
  ],
  "구동기": [
    {
      "id": "robotics",
      "name": "로봇공학과",
      "category": "공학계열"
    }
  ],
  "기계전자": [
    {
      "id": "mechatronics",
      "name": "메카트로닉스공학과",
      "category": "공학계열"
    }
  ],
  "스마트팩토리": [
    {
      "id": "mechatronics",
      "name": "메카트로닉스공학과",
      "category": "공학계열"
    }
  ],
  "PLC": [
    {
      "id": "mechatronics",
      "name": "메카트로닉스공학과",
      "category": "공학계열"
    }
  ],
  "스마트제조": [
    {
      "id": "mechatronics",
      "name": "메카트로닉스공학과",
      "category": "공학계열"
    }
  ],
  "나노소재": [
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    },
    {
      "id": "nano",
      "name": "나노공학과",
      "category": "공학계열"
    }
  ],
  "세라믹": [
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    },
    {
      "id": "ceramic-art",
      "name": "도예과",
      "category": "예체능계열"
    }
  ],
  "복합재료": [
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    }
  ],
  "소재개발": [
    {
      "id": "new-materials",
      "name": "신소재공학과",
      "category": "공학계열"
    }
  ],
  "열처리": [
    {
      "id": "metallurgy",
      "name": "금속재료공학과",
      "category": "공학계열"
    }
  ],
  "금속가공": [
    {
      "id": "metallurgy",
      "name": "금속재료공학과",
      "category": "공학계열"
    }
  ],
  "고분자": [
    {
      "id": "textile",
      "name": "섬유공학과",
      "category": "공학계열"
    }
  ],
  "텍스타일": [
    {
      "id": "textile",
      "name": "섬유공학과",
      "category": "공학계열"
    },
    {
      "id": "fashion-design",
      "name": "패션디자인학과",
      "category": "예체능계열"
    }
  ],
  "패션소재": [
    {
      "id": "textile",
      "name": "섬유공학과",
      "category": "공학계열"
    }
  ],
  "나노섬유": [
    {
      "id": "textile",
      "name": "섬유공학과",
      "category": "공학계열"
    }
  ],
  "스마트섬유": [
    {
      "id": "textile",
      "name": "섬유공학과",
      "category": "공학계열"
    }
  ],
  "고분자합성": [
    {
      "id": "textile",
      "name": "섬유공학과",
      "category": "공학계열"
    }
  ],
  "식품안전": [
    {
      "id": "food-engineering",
      "name": "식품공학과",
      "category": "공학계열"
    }
  ],
  "미생물": [
    {
      "id": "food-engineering",
      "name": "식품공학과",
      "category": "공학계열"
    },
    {
      "id": "clinical-pathology",
      "name": "임상병리학과",
      "category": "의약계열"
    }
  ],
  "생명공학": [
    {
      "id": "food-engineering",
      "name": "식품공학과",
      "category": "공학계열"
    },
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "식품개발": [
    {
      "id": "food-engineering",
      "name": "식품공학과",
      "category": "공학계열"
    }
  ],
  "탄소중립": [
    {
      "id": "environmental",
      "name": "환경공학과",
      "category": "공학계열"
    },
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "대기오염": [
    {
      "id": "environmental",
      "name": "환경공학과",
      "category": "공학계열"
    }
  ],
  "폐기물처리": [
    {
      "id": "environmental",
      "name": "환경공학과",
      "category": "공학계열"
    }
  ],
  "신재생에너지": [
    {
      "id": "environmental",
      "name": "환경공학과",
      "category": "공학계열"
    }
  ],
  "기후변화": [
    {
      "id": "environmental",
      "name": "환경공학과",
      "category": "공학계열"
    },
    {
      "id": "atmospheric",
      "name": "대기과학과",
      "category": "자연계열"
    }
  ],
  "수처리": [
    {
      "id": "environmental",
      "name": "환경공학과",
      "category": "공학계열"
    }
  ],
  "인프라": [
    {
      "id": "civil-construction",
      "name": "토목공학과",
      "category": "공학계열"
    }
  ],
  "구조설계": [
    {
      "id": "civil-construction",
      "name": "토목공학과",
      "category": "공학계열"
    }
  ],
  "지반공학": [
    {
      "id": "civil-construction",
      "name": "토목공학과",
      "category": "공학계열"
    }
  ],
  "건설관리": [
    {
      "id": "civil-construction",
      "name": "토목공학과",
      "category": "공학계열"
    }
  ],
  "토지이용": [
    {
      "id": "urban-planning-eng",
      "name": "도시공학과",
      "category": "공학계열"
    }
  ],
  "재개발": [
    {
      "id": "urban-planning-eng",
      "name": "도시공학과",
      "category": "공학계열"
    }
  ],
  "공간분석": [
    {
      "id": "urban-planning-eng",
      "name": "도시공학과",
      "category": "공학계열"
    }
  ],
  "ITS": [
    {
      "id": "transportation",
      "name": "교통공학과",
      "category": "공학계열"
    }
  ],
  "도로설계": [
    {
      "id": "transportation",
      "name": "교통공학과",
      "category": "공학계열"
    }
  ],
  "신호시스템": [
    {
      "id": "transportation",
      "name": "교통공학과",
      "category": "공학계열"
    }
  ],
  "자율주행교통": [
    {
      "id": "transportation",
      "name": "교통공학과",
      "category": "공학계열"
    }
  ],
  "시스템": [
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "신뢰성": [
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "국방시스템": [
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "품질공학": [
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "모델링": [
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "시뮬레이션": [
    {
      "id": "systems",
      "name": "시스템공학과",
      "category": "공학계열"
    }
  ],
  "원자력": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "방사선": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    },
    {
      "id": "radiology",
      "name": "방사선학과",
      "category": "의약계열"
    }
  ],
  "핵연료": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "핵에너지": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "방사선안전": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "플라즈마": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "발전소": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "핵폐기물": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "핵물리": [
    {
      "id": "nuclear",
      "name": "원자력공학과",
      "category": "공학계열"
    }
  ],
  "신재생": [
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    },
    {
      "id": "ocean-engineering",
      "name": "해양공학과",
      "category": "공학계열"
    }
  ],
  "태양광": [
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "풍력발전": [
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "발전시스템": [
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "에너지저장": [
    {
      "id": "energy",
      "name": "에너지공학과",
      "category": "공학계열"
    }
  ],
  "MEMS": [
    {
      "id": "nano",
      "name": "나노공학과",
      "category": "공학계열"
    }
  ],
  "전자소자": [
    {
      "id": "nano",
      "name": "나노공학과",
      "category": "공학계열"
    }
  ],
  "나노공정": [
    {
      "id": "nano",
      "name": "나노공학과",
      "category": "공학계열"
    }
  ],
  "유전공학": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "줄기세포": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "단백질공학": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "생물학": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "의약품": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "DNA": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "합성생물학": [
    {
      "id": "bio-engineering",
      "name": "생명공학과",
      "category": "공학계열"
    }
  ],
  "인간공학": [
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "제품설계": [
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "서비스디자인": [
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "프로토타이핑": [
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "사용자연구": [
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "HCI": [
    {
      "id": "industrial-design-eng",
      "name": "산업디자인공학과",
      "category": "공학계열"
    }
  ],
  "에너지자원": [
    {
      "id": "mining",
      "name": "자원공학과",
      "category": "공학계열"
    }
  ],
  "지질조사": [
    {
      "id": "mining",
      "name": "자원공학과",
      "category": "공학계열"
    }
  ],
  "석유가스": [
    {
      "id": "mining",
      "name": "자원공학과",
      "category": "공학계열"
    }
  ],
  "자원개발": [
    {
      "id": "mining",
      "name": "자원공학과",
      "category": "공학계열"
    }
  ],
  "스마트팜": [
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "유전자조작": [
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "식물생명": [
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "바이오기술": [
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "토양과학": [
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "작물보호": [
    {
      "id": "agricultural-engineering",
      "name": "농업생명공학과",
      "category": "공학계열"
    }
  ],
  "해양자원": [
    {
      "id": "ocean-engineering",
      "name": "해양공학과",
      "category": "공학계열"
    }
  ],
  "파력발전": [
    {
      "id": "ocean-engineering",
      "name": "해양공학과",
      "category": "공학계열"
    }
  ],
  "해저케이블": [
    {
      "id": "ocean-engineering",
      "name": "해양공학과",
      "category": "공학계열"
    }
  ],
  "해양탐사": [
    {
      "id": "ocean-engineering",
      "name": "해양공학과",
      "category": "공학계열"
    }
  ],
  "환경지구": [
    {
      "id": "earth-science",
      "name": "지구과학과",
      "category": "자연계열"
    }
  ],
  "지구물리": [
    {
      "id": "earth-science",
      "name": "지구과학과",
      "category": "자연계열"
    }
  ],
  "망원경": [
    {
      "id": "astronomy",
      "name": "천문우주학과",
      "category": "자연계열"
    }
  ],
  "우주탐사": [
    {
      "id": "astronomy",
      "name": "천문우주학과",
      "category": "자연계열"
    }
  ],
  "천체물리": [
    {
      "id": "astronomy",
      "name": "천문우주학과",
      "category": "자연계열"
    }
  ],
  "데이터분석": [
    {
      "id": "statistics",
      "name": "통계학과",
      "category": "자연계열"
    }
  ],
  "보험수리": [
    {
      "id": "statistics",
      "name": "통계학과",
      "category": "자연계열"
    }
  ],
  "날씨예보": [
    {
      "id": "atmospheric",
      "name": "대기과학과",
      "category": "자연계열"
    }
  ],
  "위성기상": [
    {
      "id": "atmospheric",
      "name": "대기과학과",
      "category": "자연계열"
    }
  ],
  "수치예보": [
    {
      "id": "atmospheric",
      "name": "대기과학과",
      "category": "자연계열"
    }
  ],
  "해양환경": [
    {
      "id": "oceanography",
      "name": "해양학과",
      "category": "자연계열"
    }
  ],
  "어업자원": [
    {
      "id": "oceanography",
      "name": "해양학과",
      "category": "자연계열"
    }
  ],
  "해류조사": [
    {
      "id": "oceanography",
      "name": "해양학과",
      "category": "자연계열"
    }
  ],
  "생태계": [
    {
      "id": "oceanography",
      "name": "해양학과",
      "category": "자연계열"
    }
  ],
  "지하자원": [
    {
      "id": "geology",
      "name": "지질학과",
      "category": "자연계열"
    }
  ],
  "화산암석": [
    {
      "id": "geology",
      "name": "지질학과",
      "category": "자연계열"
    }
  ],
  "지형분석": [
    {
      "id": "geology",
      "name": "지질학과",
      "category": "자연계열"
    }
  ],
  "환경지질": [
    {
      "id": "geology",
      "name": "지질학과",
      "category": "자연계열"
    }
  ],
  "식물재배": [
    {
      "id": "agriculture",
      "name": "농학과",
      "category": "자연계열"
    }
  ],
  "병충해": [
    {
      "id": "agriculture",
      "name": "농학과",
      "category": "자연계열"
    }
  ],
  "농산물": [
    {
      "id": "agriculture",
      "name": "농학과",
      "category": "자연계열"
    }
  ],
  "스마트농업": [
    {
      "id": "agriculture",
      "name": "농학과",
      "category": "자연계열"
    }
  ],
  "작물개량": [
    {
      "id": "agriculture",
      "name": "농학과",
      "category": "자연계열"
    }
  ],
  "산불예방": [
    {
      "id": "forestry",
      "name": "산림학과",
      "category": "자연계열"
    }
  ],
  "탄소흡수": [
    {
      "id": "forestry",
      "name": "산림학과",
      "category": "자연계열"
    }
  ],
  "산림환경": [
    {
      "id": "forestry",
      "name": "산림학과",
      "category": "자연계열"
    }
  ],
  "채소재배": [
    {
      "id": "horticulture",
      "name": "원예학과",
      "category": "자연계열"
    }
  ],
  "도시농업": [
    {
      "id": "horticulture",
      "name": "원예학과",
      "category": "자연계열"
    }
  ],
  "식물치료": [
    {
      "id": "horticulture",
      "name": "원예학과",
      "category": "자연계열"
    }
  ],
  "가축관리": [
    {
      "id": "animal-science",
      "name": "동물자원학과",
      "category": "자연계열"
    }
  ],
  "사료영양": [
    {
      "id": "animal-science",
      "name": "동물자원학과",
      "category": "자연계열"
    }
  ],
  "육류가공": [
    {
      "id": "animal-science",
      "name": "동물자원학과",
      "category": "자연계열"
    }
  ],
  "동물복지": [
    {
      "id": "animal-science",
      "name": "동물자원학과",
      "category": "자연계열"
    }
  ],
  "어병학": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "어류생물": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "해양생물": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "수산자원": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "양식기술": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "어병진단": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "수산식품": [
    {
      "id": "fisheries",
      "name": "수산생명의학과",
      "category": "자연계열"
    }
  ],
  "치아치료": [
    {
      "id": "dentistry",
      "name": "치의예과",
      "category": "의약계열"
    }
  ],
  "치과의사": [
    {
      "id": "dentistry",
      "name": "치의예과",
      "category": "의약계열"
    }
  ],
  "구강외과": [
    {
      "id": "dentistry",
      "name": "치의예과",
      "category": "의약계열"
    }
  ],
  "예방치학": [
    {
      "id": "dentistry",
      "name": "치의예과",
      "category": "의약계열"
    }
  ],
  "한의학": [
    {
      "id": "korean-medicine",
      "name": "한의예과",
      "category": "의약계열"
    }
  ],
  "한방치료": [
    {
      "id": "korean-medicine",
      "name": "한의예과",
      "category": "의약계열"
    }
  ],
  "동양의학": [
    {
      "id": "korean-medicine",
      "name": "한의예과",
      "category": "의약계열"
    }
  ],
  "한의사": [
    {
      "id": "korean-medicine",
      "name": "한의예과",
      "category": "의약계열"
    }
  ],
  "수의사": [
    {
      "id": "veterinary",
      "name": "수의예과",
      "category": "의약계열"
    }
  ],
  "가축진료": [
    {
      "id": "veterinary",
      "name": "수의예과",
      "category": "의약계열"
    }
  ],
  "동물병원": [
    {
      "id": "veterinary",
      "name": "수의예과",
      "category": "의약계열"
    }
  ],
  "야생동물": [
    {
      "id": "veterinary",
      "name": "수의예과",
      "category": "의약계열"
    }
  ],
  "진단검사": [
    {
      "id": "clinical-pathology",
      "name": "임상병리학과",
      "category": "의약계열"
    }
  ],
  "임상의학": [
    {
      "id": "clinical-pathology",
      "name": "임상병리학과",
      "category": "의약계열"
    }
  ],
  "혈액검사": [
    {
      "id": "clinical-pathology",
      "name": "임상병리학과",
      "category": "의약계열"
    }
  ],
  "조직검사": [
    {
      "id": "clinical-pathology",
      "name": "임상병리학과",
      "category": "의약계열"
    }
  ],
  "영상진단": [
    {
      "id": "radiology",
      "name": "방사선학과",
      "category": "의약계열"
    }
  ],
  "MRI": [
    {
      "id": "radiology",
      "name": "방사선학과",
      "category": "의약계열"
    }
  ],
  "의료영상": [
    {
      "id": "radiology",
      "name": "방사선학과",
      "category": "의약계열"
    }
  ],
  "방사선치료": [
    {
      "id": "radiology",
      "name": "방사선학과",
      "category": "의약계열"
    }
  ],
  "초음파": [
    {
      "id": "radiology",
      "name": "방사선학과",
      "category": "의약계열"
    }
  ],
  "작업치료": [
    {
      "id": "occupational-therapy",
      "name": "작업치료학과",
      "category": "의약계열"
    }
  ],
  "장애인재활": [
    {
      "id": "occupational-therapy",
      "name": "작업치료학과",
      "category": "의약계열"
    }
  ],
  "신체기능": [
    {
      "id": "occupational-therapy",
      "name": "작업치료학과",
      "category": "의약계열"
    }
  ],
  "인지재활": [
    {
      "id": "occupational-therapy",
      "name": "작업치료학과",
      "category": "의약계열"
    }
  ],
  "치료계획": [
    {
      "id": "occupational-therapy",
      "name": "작업치료학과",
      "category": "의약계열"
    }
  ],
  "보조기구": [
    {
      "id": "occupational-therapy",
      "name": "작업치료학과",
      "category": "의약계열"
    }
  ],
  "물리치료": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    }
  ],
  "운동치료": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    }
  ],
  "근골격재활": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    }
  ],
  "신경재활": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    }
  ],
  "통증치료": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    }
  ],
  "치료사": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    }
  ],
  "스포츠의학": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    },
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "운동처방": [
    {
      "id": "physical-therapy",
      "name": "물리치료학과",
      "category": "의약계열"
    },
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "심폐소생": [
    {
      "id": "emergency-medical",
      "name": "응급구조학과",
      "category": "의약계열"
    }
  ],
  "119구급": [
    {
      "id": "emergency-medical",
      "name": "응급구조학과",
      "category": "의약계열"
    }
  ],
  "외상처치": [
    {
      "id": "emergency-medical",
      "name": "응급구조학과",
      "category": "의약계열"
    }
  ],
  "응급의학": [
    {
      "id": "emergency-medical",
      "name": "응급구조학과",
      "category": "의약계열"
    }
  ],
  "생명구조": [
    {
      "id": "emergency-medical",
      "name": "응급구조학과",
      "category": "의약계열"
    }
  ],
  "중증처치": [
    {
      "id": "emergency-medical",
      "name": "응급구조학과",
      "category": "의약계열"
    }
  ],
  "질병예방": [
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "역학조사": [
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "건강증진": [
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "환경보건": [
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "의료통계": [
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "감염병": [
    {
      "id": "public-health",
      "name": "보건학과",
      "category": "의약계열"
    }
  ],
  "시각디자인": [
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    }
  ],
  "그래픽디자인": [
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    }
  ],
  "타이포그래피": [
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    }
  ],
  "일러스트": [
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    }
  ],
  "포스터": [
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    }
  ],
  "광고디자인": [
    {
      "id": "visual-design",
      "name": "시각디자인학과",
      "category": "예체능계열"
    }
  ],
  "사용자경험": [
    {
      "id": "industrial-design",
      "name": "산업디자인학과",
      "category": "예체능계열"
    }
  ],
  "3D모델링": [
    {
      "id": "industrial-design",
      "name": "산업디자인학과",
      "category": "예체능계열"
    },
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "제품개발": [
    {
      "id": "industrial-design",
      "name": "산업디자인학과",
      "category": "예체능계열"
    }
  ],
  "프로토타입": [
    {
      "id": "industrial-design",
      "name": "산업디자인학과",
      "category": "예체능계열"
    }
  ],
  "의류제작": [
    {
      "id": "fashion-design",
      "name": "패션디자인학과",
      "category": "예체능계열"
    }
  ],
  "스타일링": [
    {
      "id": "fashion-design",
      "name": "패션디자인학과",
      "category": "예체능계열"
    }
  ],
  "패션쇼": [
    {
      "id": "fashion-design",
      "name": "패션디자인학과",
      "category": "예체능계열"
    }
  ],
  "인테리어": [
    {
      "id": "interior-design",
      "name": "실내건축디자인학과",
      "category": "예체능계열"
    }
  ],
  "가구디자인": [
    {
      "id": "interior-design",
      "name": "실내건축디자인학과",
      "category": "예체능계열"
    }
  ],
  "실내디자인": [
    {
      "id": "interior-design",
      "name": "실내건축디자인학과",
      "category": "예체능계열"
    }
  ],
  "공간연출": [
    {
      "id": "interior-design",
      "name": "실내건축디자인학과",
      "category": "예체능계열"
    }
  ],
  "동양화": [
    {
      "id": "painting-eastern",
      "name": "동양화과",
      "category": "예체능계열"
    }
  ],
  "한국화": [
    {
      "id": "painting-eastern",
      "name": "동양화과",
      "category": "예체능계열"
    }
  ],
  "채색화": [
    {
      "id": "painting-eastern",
      "name": "동양화과",
      "category": "예체능계열"
    }
  ],
  "전통미술": [
    {
      "id": "painting-eastern",
      "name": "동양화과",
      "category": "예체능계열"
    }
  ],
  "현대미술": [
    {
      "id": "painting-western",
      "name": "서양화과",
      "category": "예체능계열"
    }
  ],
  "아크릴": [
    {
      "id": "painting-western",
      "name": "서양화과",
      "category": "예체능계열"
    }
  ],
  "미술관": [
    {
      "id": "painting-western",
      "name": "서양화과",
      "category": "예체능계열"
    }
  ],
  "설치미술": [
    {
      "id": "painting-western",
      "name": "서양화과",
      "category": "예체능계열"
    }
  ],
  "현대미술표현": [
    {
      "id": "painting-western",
      "name": "서양화과",
      "category": "예체능계열"
    }
  ],
  "공공미술": [
    {
      "id": "sculpture",
      "name": "조소과",
      "category": "예체능계열"
    }
  ],
  "조형예술": [
    {
      "id": "sculpture",
      "name": "조소과",
      "category": "예체능계열"
    }
  ],
  "금속조각": [
    {
      "id": "sculpture",
      "name": "조소과",
      "category": "예체능계열"
    }
  ],
  "공공설치": [
    {
      "id": "sculpture",
      "name": "조소과",
      "category": "예체능계열"
    }
  ],
  "도자기": [
    {
      "id": "ceramic-art",
      "name": "도예과",
      "category": "예체능계열"
    }
  ],
  "도자예술": [
    {
      "id": "ceramic-art",
      "name": "도예과",
      "category": "예체능계열"
    }
  ],
  "흙빚기": [
    {
      "id": "ceramic-art",
      "name": "도예과",
      "category": "예체능계열"
    }
  ],
  "전통공예": [
    {
      "id": "ceramic-art",
      "name": "도예과",
      "category": "예체능계열"
    }
  ],
  "세라믹아트": [
    {
      "id": "ceramic-art",
      "name": "도예과",
      "category": "예체능계열"
    }
  ],
  "이미지": [
    {
      "id": "photography",
      "name": "사진학과",
      "category": "예체능계열"
    }
  ],
  "촬영기법": [
    {
      "id": "photography",
      "name": "사진학과",
      "category": "예체능계열"
    }
  ],
  "사진편집": [
    {
      "id": "photography",
      "name": "사진학과",
      "category": "예체능계열"
    }
  ],
  "사진예술": [
    {
      "id": "photography",
      "name": "사진학과",
      "category": "예체능계열"
    }
  ],
  "시나리오": [
    {
      "id": "film-tv",
      "name": "영화영상학과",
      "category": "예체능계열"
    },
    {
      "id": "theater-film",
      "name": "연극영화학과",
      "category": "예체능계열"
    }
  ],
  "드라마제작": [
    {
      "id": "film-tv",
      "name": "영화영상학과",
      "category": "예체능계열"
    }
  ],
  "미디어콘텐츠": [
    {
      "id": "film-tv",
      "name": "영화영상학과",
      "category": "예체능계열"
    }
  ],
  "애니메이션": [
    {
      "id": "animation",
      "name": "만화애니메이션학과",
      "category": "예체능계열"
    },
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "캐릭터디자인": [
    {
      "id": "animation",
      "name": "만화애니메이션학과",
      "category": "예체능계열"
    }
  ],
  "스토리보드": [
    {
      "id": "animation",
      "name": "만화애니메이션학과",
      "category": "예체능계열"
    }
  ],
  "디지털애니": [
    {
      "id": "animation",
      "name": "만화애니메이션학과",
      "category": "예체능계열"
    }
  ],
  "캐릭터": [
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "텍스처아트": [
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "언리얼엔진": [
    {
      "id": "game-graphics",
      "name": "게임그래픽디자인학과",
      "category": "예체능계열"
    }
  ],
  "음악이론": [
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "음악사": [
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "악기연주": [
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "화성분석": [
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "작곡이론": [
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "음악학": [
    {
      "id": "music-theory",
      "name": "음악학과",
      "category": "예체능계열"
    }
  ],
  "화성학": [
    {
      "id": "composition",
      "name": "작곡과",
      "category": "예체능계열"
    }
  ],
  "대위법": [
    {
      "id": "composition",
      "name": "작곡과",
      "category": "예체능계열"
    }
  ],
  "오케스트레이션": [
    {
      "id": "composition",
      "name": "작곡과",
      "category": "예체능계열"
    }
  ],
  "MIDI": [
    {
      "id": "composition",
      "name": "작곡과",
      "category": "예체능계열"
    }
  ],
  "음악제작": [
    {
      "id": "composition",
      "name": "작곡과",
      "category": "예체능계열"
    }
  ],
  "오페라": [
    {
      "id": "vocal",
      "name": "성악과",
      "category": "예체능계열"
    }
  ],
  "독창곡": [
    {
      "id": "vocal",
      "name": "성악과",
      "category": "예체능계열"
    }
  ],
  "음악공연": [
    {
      "id": "vocal",
      "name": "성악과",
      "category": "예체능계열"
    }
  ],
  "발성훈련": [
    {
      "id": "vocal",
      "name": "성악과",
      "category": "예체능계열"
    }
  ],
  "레퍼토리": [
    {
      "id": "piano",
      "name": "피아노학과",
      "category": "예체능계열"
    }
  ],
  "건반악기": [
    {
      "id": "piano",
      "name": "피아노학과",
      "category": "예체능계열"
    }
  ],
  "클래식음악": [
    {
      "id": "piano",
      "name": "피아노학과",
      "category": "예체능계열"
    }
  ],
  "콩쿠르": [
    {
      "id": "piano",
      "name": "피아노학과",
      "category": "예체능계열"
    }
  ],
  "관현악": [
    {
      "id": "orchestra",
      "name": "관현악과",
      "category": "예체능계열"
    }
  ],
  "오케스트라": [
    {
      "id": "orchestra",
      "name": "관현악과",
      "category": "예체능계열"
    }
  ],
  "현악기": [
    {
      "id": "orchestra",
      "name": "관현악과",
      "category": "예체능계열"
    }
  ],
  "관악기": [
    {
      "id": "orchestra",
      "name": "관현악과",
      "category": "예체능계열"
    }
  ],
  "앙상블연주": [
    {
      "id": "orchestra",
      "name": "관현악과",
      "category": "예체능계열"
    }
  ],
  "실내악": [
    {
      "id": "orchestra",
      "name": "관현악과",
      "category": "예체능계열"
    }
  ],
  "전통음악": [
    {
      "id": "korean-music",
      "name": "한국음악과",
      "category": "예체능계열"
    }
  ],
  "가야금": [
    {
      "id": "korean-music",
      "name": "한국음악과",
      "category": "예체능계열"
    }
  ],
  "판소리": [
    {
      "id": "korean-music",
      "name": "한국음악과",
      "category": "예체능계열"
    }
  ],
  "거문고": [
    {
      "id": "korean-music",
      "name": "한국음악과",
      "category": "예체능계열"
    }
  ],
  "전통예술": [
    {
      "id": "korean-music",
      "name": "한국음악과",
      "category": "예체능계열"
    }
  ],
  "실용음악": [
    {
      "id": "applied-music",
      "name": "실용음악과",
      "category": "예체능계열"
    }
  ],
  "프로듀싱": [
    {
      "id": "applied-music",
      "name": "실용음악과",
      "category": "예체능계열"
    }
  ],
  "밴드연주": [
    {
      "id": "applied-music",
      "name": "실용음악과",
      "category": "예체능계열"
    }
  ],
  "음반제작": [
    {
      "id": "applied-music",
      "name": "실용음악과",
      "category": "예체능계열"
    }
  ],
  "뮤지션": [
    {
      "id": "applied-music",
      "name": "실용음악과",
      "category": "예체능계열"
    }
  ],
  "현대무용": [
    {
      "id": "dance",
      "name": "무용학과",
      "category": "예체능계열"
    }
  ],
  "한국무용": [
    {
      "id": "dance",
      "name": "무용학과",
      "category": "예체능계열"
    }
  ],
  "신체표현": [
    {
      "id": "dance",
      "name": "무용학과",
      "category": "예체능계열"
    }
  ],
  "공연예술": [
    {
      "id": "dance",
      "name": "무용학과",
      "category": "예체능계열"
    },
    {
      "id": "theater-film",
      "name": "연극영화학과",
      "category": "예체능계열"
    }
  ],
  "무대연출": [
    {
      "id": "theater-film",
      "name": "연극영화학과",
      "category": "예체능계열"
    }
  ],
  "연기자": [
    {
      "id": "theater-film",
      "name": "연극영화학과",
      "category": "예체능계열"
    }
  ],
  "영화제작": [
    {
      "id": "theater-film",
      "name": "연극영화학과",
      "category": "예체능계열"
    }
  ],
  "선수트레이닝": [
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "스포츠데이터": [
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "훈련방법": [
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "체력측정": [
    {
      "id": "sports-science",
      "name": "스포츠과학과",
      "category": "예체능계열"
    }
  ],
  "생활체육": [
    {
      "id": "social-sports",
      "name": "사회체육학과",
      "category": "예체능계열"
    }
  ],
  "스포츠지도사": [
    {
      "id": "social-sports",
      "name": "사회체육학과",
      "category": "예체능계열"
    }
  ],
  "운동프로그램": [
    {
      "id": "social-sports",
      "name": "사회체육학과",
      "category": "예체능계열"
    }
  ],
  "피트니스": [
    {
      "id": "social-sports",
      "name": "사회체육학과",
      "category": "예체능계열"
    }
  ],
  "야외스포츠": [
    {
      "id": "social-sports",
      "name": "사회체육학과",
      "category": "예체능계열"
    }
  ],
  "태권도": [
    {
      "id": "taekwondo",
      "name": "태권도학과",
      "category": "예체능계열"
    }
  ],
  "국제보급": [
    {
      "id": "taekwondo",
      "name": "태권도학과",
      "category": "예체능계열"
    }
  ],
  "올림픽종목": [
    {
      "id": "taekwondo",
      "name": "태권도학과",
      "category": "예체능계열"
    }
  ],
  "지도자": [
    {
      "id": "taekwondo",
      "name": "태권도학과",
      "category": "예체능계열"
    }
  ],
  "체력단련": [
    {
      "id": "taekwondo",
      "name": "태권도학과",
      "category": "예체능계열"
    }
  ],
  "태권도보급": [
    {
      "id": "taekwondo",
      "name": "태권도학과",
      "category": "예체능계열"
    }
  ]
};