import universitiesJson from "@/seed/universities.json";
import universityMajorsJson from "@/seed/university_majors.json";
import majorsJson from "@/seed/majors.json";
import type { Major, University, UniversityMajor } from "@/types/major";

const universities = universitiesJson as University[];
const universityMajors = universityMajorsJson as UniversityMajor[];
const majors = majorsJson as Major[];

export const UNIVERSITY_TYPE_LABEL: Record<University["type"], string> = {
  NATIONAL: "국립",
  PRIVATE: "사립",
  SPECIAL: "특수",
};

export function getAllUniversities(): University[] {
  return universities;
}

export function getUniversityRegions(): string[] {
  return Array.from(new Set(universities.map((u) => u.region))).sort();
}

export function searchUniversities(opts?: {
  query?: string;
  region?: string;
  type?: string;
  majorId?: string;
}): University[] {
  const q = opts?.query?.trim().toLowerCase();
  let mappedUniIds: Set<string> | null = null;
  if (opts?.majorId) {
    mappedUniIds = new Set(
      universityMajors
        .filter((um) => um.majorId === opts.majorId)
        .map((um) => um.universityId),
    );
  }
  return universities.filter((u) => {
    if (
      q &&
      !u.name.toLowerCase().includes(q) &&
      !u.shortName.toLowerCase().includes(q)
    )
      return false;
    if (opts?.region && opts.region !== "전체" && u.region !== opts.region)
      return false;
    if (opts?.type && opts.type !== "전체" && u.type !== opts.type)
      return false;
    if (mappedUniIds && !mappedUniIds.has(u.id)) return false;
    return true;
  });
}

export type UniversityDetail = University & {
  majors: Array<Major & { admissionQuota?: number }>;
};

export function getUniversityById(id: string): UniversityDetail | null {
  const uni = universities.find((u) => u.id === id);
  if (!uni) return null;
  const linked = universityMajors
    .filter((um) => um.universityId === id)
    .flatMap<Major & { admissionQuota?: number }>((um) => {
      const m = majors.find((x) => x.id === um.majorId);
      return m ? [{ ...m, admissionQuota: um.admissionQuota }] : [];
    });
  return { ...uni, majors: linked };
}
