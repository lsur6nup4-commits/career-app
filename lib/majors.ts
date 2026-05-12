import majorsJson from "@/seed/majors.json";
import universitiesJson from "@/seed/universities.json";
import universityMajorsJson from "@/seed/university_majors.json";
import majorExtrasJson from "@/seed/major_extras.json";
import courseDescriptionsJson from "@/seed/course_descriptions.json";
import subjectsJson from "@/seed/subjects.json";
import type {
  FullMajor,
  Major,
  MajorExtras,
  MajorWithUniversities,
  Subject,
  University,
  UniversityMajor,
} from "@/types/major";

const majors = majorsJson as Major[];
const universities = universitiesJson as University[];
const universityMajors = universityMajorsJson as UniversityMajor[];

// _note 키를 제외하고 학과 ID → 보강 데이터 매핑
const { _note: _extrasNote, ...extrasMap } = majorExtrasJson as Record<
  string,
  MajorExtras | string
>;
const { _note: _descNote, ...courseDescriptionMap } =
  courseDescriptionsJson as Record<string, string>;
const { _note: _subjNote, ...subjectsMap } = subjectsJson as Record<
  string,
  Subject | string
>;

void _extrasNote;
void _descNote;
void _subjNote;

export function getAllMajors(): Major[] {
  return majors;
}

export function getMajorCategories(): string[] {
  return Array.from(new Set(majors.map((m) => m.category)));
}

export function searchMajors(query?: string, category?: string): Major[] {
  return majors.filter((m) => {
    const matchCategory = !category || category === "전체" || m.category === category;
    const q = query?.trim().toLowerCase();
    const matchQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.keywords.some((k) => k.toLowerCase().includes(q));
    return matchCategory && matchQuery;
  });
}

function getCourseDescriptions(curriculum: Major["curriculum"]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const year of curriculum) {
    for (const course of year.courses) {
      const desc = courseDescriptionMap[course];
      if (desc) result[course] = desc;
    }
  }
  return result;
}

function getSubjectsForCurriculum(
  curriculum: Major["curriculum"],
): Record<string, Subject> {
  const result: Record<string, Subject> = {};
  for (const year of curriculum) {
    for (const course of year.courses) {
      const entry = subjectsMap[course];
      if (entry && typeof entry === "object") {
        result[course] = entry;
      }
    }
  }
  return result;
}

export function getSubjectByName(name: string): Subject | null {
  const entry = subjectsMap[name];
  return entry && typeof entry === "object" ? entry : null;
}

export function getMajorById(id: string): MajorWithUniversities | null {
  const major = majors.find((m) => m.id === id);
  if (!major) return null;

  const linked = universityMajors
    .filter((um) => um.majorId === id)
    .flatMap<University & { admissionQuota?: number }>((um) => {
      const uni = universities.find((u) => u.id === um.universityId);
      return uni ? [{ ...uni, admissionQuota: um.admissionQuota }] : [];
    });

  return { ...major, universities: linked };
}

export function getFullMajorById(id: string): FullMajor | null {
  const base = getMajorById(id);
  if (!base) return null;

  const extras = extrasMap[id];
  const merged: FullMajor = {
    ...base,
    courseDescriptions: getCourseDescriptions(base.curriculum),
    subjects: getSubjectsForCurriculum(base.curriculum),
  };

  if (extras && typeof extras === "object") {
    Object.assign(merged, extras);
  }

  return merged;
}
