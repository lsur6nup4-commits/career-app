import {
  getAllUniversities,
  getUniversityRegions,
} from "@/lib/universities";
import { getAllMajors } from "@/lib/majors";
import { UniversitySearch } from "@/components/university/university-search";
import universityMajorsJson from "@/seed/university_majors.json";
import type { UniversityMajor } from "@/types/major";

export const metadata = {
  title: "대학 탐색 — 진로나침반",
};

export default function UniversitiesPage() {
  const universities = getAllUniversities();
  const regions = getUniversityRegions();
  const majors = getAllMajors();
  const universityMajors = universityMajorsJson as UniversityMajor[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대학 탐색</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전국 4년제 대학 {universities.length}곳을 지역·유형·개설 학과로 찾아보세요.
        </p>
      </div>
      <UniversitySearch
        universities={universities}
        regions={regions}
        majors={majors}
        universityMajors={universityMajors}
      />
    </div>
  );
}
