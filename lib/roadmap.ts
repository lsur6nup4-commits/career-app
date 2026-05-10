import type { FullMajor } from "@/types/major";

export type RoadmapItem = {
  label: string;
  detail?: string;
};

export type RoadmapStage = {
  key: string;
  phase: "HIGH_SCHOOL" | "ADMISSION" | "UNIVERSITY" | "CAREER";
  stage: string;
  title: string;
  items: RoadmapItem[];
};

export function buildRoadmap(major: FullMajor): RoadmapStage[] {
  const stages: RoadmapStage[] = [];

  stages.push({
    key: "g1",
    phase: "HIGH_SCHOOL",
    stage: "고1",
    title: "관심 분야 탐색",
    items: [
      { label: "진로 진단으로 강·약점 파악하기" },
      { label: "다양한 학과·직업 알아보기" },
      { label: "교과 외 폭넓은 독서로 시야 넓히기" },
    ],
  });

  const earlyActivities = (major.activities ?? []).slice(0, 2);
  stages.push({
    key: "g2",
    phase: "HIGH_SCHOOL",
    stage: "고2",
    title: `${major.name} 깊이 알아보기`,
    items: [
      ...earlyActivities.map((a) => ({ label: a.title, detail: a.description })),
      { label: "관심 학과 비교·자료 정리" },
      { label: "모의고사로 학력 점검" },
    ],
  });

  const lateActivities = (major.activities ?? []).slice(2);
  const susi = Math.round(major.susiRatio * 100);
  const jeongsi = Math.round(major.jeongsiRatio * 100);
  stages.push({
    key: "g3",
    phase: "HIGH_SCHOOL",
    stage: "고3",
    title: "입시 준비 본격화",
    items: [
      { label: `평균 입시 등급 ${major.averageGrade}등급 (참고 수치)` },
      { label: `수시 ${susi}% / 정시 ${jeongsi}% 비율로 전형 균형 잡기` },
      ...lateActivities.slice(0, 2).map((a) => ({ label: a.title, detail: a.description })),
      { label: "자기소개서·면접 대비(수시 지원 시)" },
    ],
  });

  stages.push({
    key: "admission",
    phase: "ADMISSION",
    stage: "입시",
    title: `${major.name} 합격`,
    items: [
      { label: "수시 1차 → 면접·서류 → 최종 합격" },
      { label: "또는 정시(수능 점수 기반) 지원" },
      { label: "등록·OT·기숙사 준비" },
    ],
  });

  for (const year of major.curriculum) {
    stages.push({
      key: `u${year.year}`,
      phase: "UNIVERSITY",
      stage: `대학 ${year.year}학년`,
      title: yearTitle(year.year),
      items: year.courses.slice(0, 4).map((c) => ({
        label: c,
        detail: major.courseDescriptions[c],
      })),
    });
  }

  const careers = major.careers ?? [];
  stages.push({
    key: "career",
    phase: "CAREER",
    stage: "졸업 후",
    title: "진로 시작",
    items: careers.length
      ? careers.slice(0, 4).map((c) => ({
          label: c.name,
          detail: `${c.summary} · 평균 ${c.averageSalary.toLocaleString()}만원/년`,
        }))
      : [{ label: "전공 관련 다양한 분야로 진출" }],
  });

  return stages;
}

function yearTitle(year: number): string {
  switch (year) {
    case 1:
      return "기초 다지기 + 적응";
    case 2:
      return "전공 핵심 과목 진입";
    case 3:
      return "심화 + 인턴·연구 경험";
    case 4:
      return "졸업 작품 + 진로 결정";
    case 5:
      return "졸업 설계 + 실무";
    default:
      return "심화 학습";
  }
}
