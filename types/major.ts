export type CurriculumYear = {
  year: number;
  courses: string[];
};

export type Major = {
  id: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  keywords: string[];
  hollandTags: string[];
  curriculum: CurriculumYear[];
  averageGrade: number;
  jeongsiRatio: number;
  susiRatio: number;
  /** Other majors a student might also consider. Major ids. */
  relatedMajors?: string[];
  /** CSV 기반 실제 평균 입학정원 (명). import-csv-data.mjs 로 갱신. */
  averageAdmissionQuota?: number;
};

export type University = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  type: "NATIONAL" | "PRIVATE" | "SPECIAL";
  // ── 대학알리미 연동 필드 (scripts/fetch-academyinfo.ts 로 갱신) ────
  /** 대학알리미 학교코드 */
  schoolCode?: string;
  /** 대학 홈페이지 URL */
  homepageUrl?: string;
  /** 설립연도 */
  establishedYear?: number;
  /** 재학생 수 */
  totalStudents?: number;
  /** 연간 평균 등록금 (만원). FinanceInfoService 기준. */
  tuitionAvg?: number;
  /** 학부 입학정원 (명). SchoolInfoService 기준. */
  admissionQuotaTotal?: number;
};

export type UniversityMajor = {
  majorId: string;
  universityId: string;
  /** 입학 정원. 추후 공공 API 연동 시 채워질 placeholder. */
  admissionQuota?: number;
};

export type Career = {
  name: string;
  averageSalary: number; // 만원/년 (placeholder)
  summary: string;
};

export type EmploymentSlice = {
  category: string;
  ratio: number; // 0~1
};

export type IndustryOutlook = {
  direction: "GROWING" | "STABLE" | "DECLINING" | "TRANSFORMING";
  summary: string;
};

export type RecommendedActivity = {
  type: "CLUB" | "CONTEST" | "VOLUNTEER" | "READING" | "PROJECT";
  title: string;
  description: string;
};

export type RecommendedBook = {
  title: string;
  author: string;
  summary: string;
};

export type MajorExtras = {
  careers: Career[];
  employmentDistribution: EmploymentSlice[];
  certifications: string[];
  gradSchoolOptions: string[];
  industryTrends: string[];
  outlook: IndustryOutlook;
  industryKeywords: string[];
  activities: RecommendedActivity[];
  books: RecommendedBook[];
  /** CSV 기반 관련 직업명 목록 (빈도순). import-csv-data.mjs 로 갱신. */
  careerPaths?: string[];
};

export type MajorWithUniversities = Major & {
  universities: Array<University & { admissionQuota?: number }>;
};

/**
 * Subject (커리큘럼 대표 과목) — 인터랙티브 모달용.
 * id는 과목명 그대로 사용해도 OK(JSON 키로 활용).
 */
export type Subject = {
  id: string;
  name: string;
  /** 일반적으로 배우는 학년 (1~4). 학과별로 다를 수 있으니 참고치. */
  year: 1 | 2 | 3 | 4;
  /** 한 줄 요약 (50자 이내). */
  summary: string;
  /** 상세 설명 (고등학생 눈높이, 200~400자). */
  description: string;
  /** 실생활·진로 연결 예시. */
  realWorldExample: string;
  /** 관련 고등학교 과목 (수학·정보·물리·국어 등). */
  prerequisiteHS: string[];
  /** 체감 난이도 1(쉬움) ~ 5(어려움). */
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export type FullMajor = MajorWithUniversities &
  Partial<MajorExtras> & {
    /** 기존 호환용 (subject 미정의 시 폴백). */
    courseDescriptions: Record<string, string>;
    /** 커리큘럼에 등장하는 과목명 → Subject 객체. */
    subjects: Record<string, Subject>;
  };
