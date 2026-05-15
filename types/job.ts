export type Job = {
  job_cd: number;
  job_nm: string;
  /** 직업 업무 설명 */
  work: string;
  /** 대분류 직종 */
  top_nm: string;
  /** 적성 유형 */
  aptit_name: string;
  /** 임금 수준 (예: "4천만원↑") */
  wage: string;
  /** 워크라이프밸런스 ("매우좋음" | "좋음" | "보통" | "보통미만") */
  wlb: string;
  /** 사회적 인식 ("매우좋음" | "좋음" | "보통" | "보통미만") */
  social: string;
  views: number;
  likes: number;
  /** 관련 직업명 (콤마 구분) */
  rel_job_nm: string;
  /** careerPaths 교차 매핑으로 연결된 학과 ID 목록 */
  relatedMajors: string[];
  /**
   * 워크넷 원본에 누락된 필드를 카테고리(top_nm) 평균값으로 보강한 경우,
   * 어느 필드가 AI/추정값인지 표시. UI는 이 배열에 포함된 필드 옆에
   * "AI 추정" 뱃지를 표시해야 함.
   */
  estimatedFields?: ("wage" | "wlb" | "social")[];
};

export const JOB_CATEGORIES = [
  "전체",
  "연구직 및 공학 기술직",
  "예술·디자인·방송·스포츠직",
  "설치·정비·생산직",
  "경영·사무·금융·보험직",
  "교육·법률·사회복지·경찰·소방직 및 군인",
  "미용·여행·숙박·음식·경비·청소직",
  "보건·의료직",
  "영업·판매·운전·운송직",
  "건설·채굴직",
  "농림어업직",
] as const;

export const WLB_LABEL: Record<string, string> = {
  매우좋음: "워라밸 매우 좋음",
  좋음: "워라밸 좋음",
  보통: "워라밸 보통",
  보통미만: "워라밸 보통 이하",
};

export const WAGE_ORDER: Record<string, number> = {
  "5천만원↑": 4,
  "4천만원↑": 3,
  "3천만원↑": 2,
  "3천만원↓": 1,
  "": 0,
};
