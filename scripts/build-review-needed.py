"""Generate data/_review_needed.json — items still requiring human review.

Run: python scripts/build-review-needed.py
"""
import json
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
SEED = ROOT / "seed"
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

majors = json.loads((SEED / "majors.json").read_text(encoding="utf-8"))
subjects = json.loads((SEED / "subjects.json").read_text(encoding="utf-8"))
extras = json.loads((SEED / "major_extras.json").read_text(encoding="utf-8"))

covered_subjects = {k for k in subjects if k != "_note"}
covered_extras = {k for k in extras if k != "_note"}

# Majors lacking full extras (careers/employment/industry/activities/books).
majors_without_extras = [
    {"id": m["id"], "name": m["name"], "category": m["category"]}
    for m in majors
    if m["id"] not in covered_extras
]
majors_without_extras.sort(key=lambda x: (x["category"], x["id"]))

# Course names in any curriculum that aren't yet in subjects.json.
all_courses: Counter = Counter()
course_to_majors: dict[str, list[str]] = {}
for m in majors:
    for y in m["curriculum"]:
        for c in y["courses"]:
            all_courses[c] += 1
            course_to_majors.setdefault(c, []).append(m["id"])

missing_subjects = [
    {
        "name": name,
        "occurrences": count,
        "majorIds": course_to_majors[name][:5],  # 최대 5개 예시
    }
    for name, count in all_courses.most_common()
    if name not in covered_subjects
]

manifest = {
    "_note": (
        "이 파일은 사람의 검수가 필요한 항목을 정리합니다. "
        "scripts/generate-descriptions.ts 로 Claude API 생성 후, "
        "검수 완료된 항목은 이 파일에서 제거하고 seed/*.json 으로 머지하세요."
    ),
    "majors_missing_extras": {
        "count": len(majors_without_extras),
        "items": majors_without_extras,
    },
    "subjects_missing": {
        "count": len(missing_subjects),
        "occurrences_total": sum(s["occurrences"] for s in missing_subjects),
        "items": missing_subjects,
    },
    "generated_descriptions": [],
}

target = DATA / "_review_needed.json"
target.write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"written: {target}")
print(f"  majors_missing_extras: {len(majors_without_extras)}")
print(f"  subjects_missing: {len(missing_subjects)}")
