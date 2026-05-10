import { getAllMajors, getMajorCategories } from "@/lib/majors";
import { MajorSearch } from "@/components/major/major-search";

export const metadata = {
  title: "학과 탐색 — 진로나침반",
};

export default function MajorsPage() {
  const majors = getAllMajors();
  const categories = getMajorCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">학과 탐색</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          관심 있는 학과를 찾아보고 자세한 정보를 확인해보세요.
        </p>
      </div>
      <MajorSearch majors={majors} categories={categories} />
    </div>
  );
}
