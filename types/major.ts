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
};

export type University = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  type: "NATIONAL" | "PRIVATE" | "SPECIAL";
};

export type UniversityMajor = {
  majorId: string;
  universityId: string;
  admissionQuota: number;
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
};

export type MajorWithUniversities = Major & {
  universities: Array<University & { admissionQuota: number }>;
};

export type FullMajor = MajorWithUniversities &
  Partial<MajorExtras> & {
    courseDescriptions: Record<string, string>;
  };
