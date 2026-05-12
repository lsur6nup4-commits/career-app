"""Auto-extend university_majors.json so every major has 8-10 university links.

Run: python scripts/extend-university-majors.py
"""
import json, hashlib, sys
from collections import Counter
sys.stdout.reconfigure(encoding="utf-8")

majors = json.load(open("seed/majors.json", encoding="utf-8"))
universities = json.load(open("seed/universities.json", encoding="utf-8"))
existing = json.load(open("seed/university_majors.json", encoding="utf-8"))

uni_by_id = {u["id"]: u for u in universities}

# Existing edges keyed by (majorId, universityId).
edges = {}
for e in existing:
    edges[(e["majorId"], e["universityId"])] = e

TOP = ["snu","yonsei","korea","kaist","postech","skku","hanyang","sogang","ewha","cau","khu","hufs","uos","snue","dongguk","sookmyung","soongsil","kookmin","sejong","inha","ajou","gachon","hongik"]
MED_POOL = ["snu","yonsei","korea","skku","knu","pnu","cnu","jnu","ewha","chonbuk","catholic-busan","wonkwang","soonchunhyang","chosun","konyang","dankook-cheonan","khu","hanyang","dgist","unist"]
PHARMACY_POOL = ["snu","yonsei","skku","ewha","catholic-busan","sookmyung","dongguk","duksung","wonkwang","chonbuk","knu","cnu","pnu"]
DENT_POOL = ["snu","yonsei","knu","pnu","jnu","wonkwang","chosun","dankook-cheonan","dgu","catholic-busan"]
KOREAN_MED_POOL = ["khu","dongguk","wonkwang","daegu-haany","sangji","jeonju","dgu"]
VET_POOL = ["snu","knu","jnu","pnu","cbnu","cwnu","konkuk-glocal","chonbuk","gnu-gyeongsang","jeju"]
NURSING_POOL = TOP + ["knu","pnu","cnu","jnu","chonbuk","cwnu","hallym","soonchunhyang","catholic-busan","konyang","dankook-cheonan","gnu-gyeongsang","kosin"]
EDU_POOL = ["snu","korea","ewha","hanyang","khu","cau","dongguk","sookmyung","sungshin","seoul-women","chonbuk","knu","pnu","cnu","jnu","knue","cbnu","cwnu","sangmyung","myongji"]
ELEM_EDU_POOL = ["snue-edu","knu-chuncheon","kongju-edu","jinju-edu","daegu-edu","jeonju-edu","gwangju-edu","cju-edu","pukyong-edu","kainu"]
ART_POOL = ["snu","hongik","ewha","cau","kookmin","sejong","sookmyung","seoul-women","sungshin","dongduk-women","seokyeong","sangmyung","myongji","ka-univ","seoul-tech","kgu","dankook-cheonan","korea-univ-arts"]
MUSIC_POOL = ["snu","yonsei","korea","ewha","sookmyung","sungshin","cau","khu","dongguk","dankook-cheonan","knu","pnu","ka-univ","sejong"]
PE_POOL = ["snu","korea","yonsei","hanyang","khu","ewha","cau","dongguk","kookje","kookmin","dankook-cheonan","knu","pnu","cnu","jnu","yongin","youngsan"]
LAW_POOL = TOP + ["knu","pnu","cnu","jnu","chonbuk","wonkwang","konyang"]
COMP_POOL = TOP + ["inha","knu","pnu","cnu","jnu","chonbuk","seoul-tech","sejong","hanyang","khu","dgist","unist","kentech","korea-aerospace","hanbat","soonchunhyang"]
ENG_POOL = COMP_POOL + ["hknu","kut","korea-aerospace","kpu","pufs","kmou","postech","kaist","korea-univ-sejong","konkuk-glocal","dongguk","myongji","kgu","suwon","dankook-cheonan"]
HUMAN_POOL = TOP + ["knu","pnu","cnu","jnu","chonbuk","daejeon-univ","dgu","kgu","myongji","sangmyung","soongsil","seoul-women"]
SOCIAL_POOL = HUMAN_POOL
SCIENCE_POOL = TOP + ["knu","pnu","cnu","jnu","chonbuk","kaist","postech","dgist","unist","gist","korea-aerospace","cbnu","cwnu","andong"]


def pool_for(major):
    mid = major["id"]
    cat = major["category"]
    if mid == "medicine": return MED_POOL
    if mid == "pharmacy": return PHARMACY_POOL
    if mid == "dentistry": return DENT_POOL
    if mid == "korean-medicine": return KOREAN_MED_POOL
    if mid == "veterinary": return VET_POOL
    if mid == "nursing" or mid in ("clinical-pathology","radiology","occupational-therapy","physical-therapy","emergency-medical","public-health"):
        return NURSING_POOL
    if mid == "elementary-edu": return ELEM_EDU_POOL
    if cat == "교육계열": return EDU_POOL
    if cat == "예체능계열":
        if mid in ("music-theory","composition","vocal","piano","orchestra","korean-music","applied-music"):
            return MUSIC_POOL
        if mid in ("sports-science","social-sports","taekwondo"):
            return PE_POOL
        return ART_POOL
    if cat == "공학계열": return ENG_POOL
    if cat == "자연계열": return SCIENCE_POOL
    if mid == "law": return LAW_POOL
    if cat == "사회계열": return SOCIAL_POOL
    if cat == "인문계열": return HUMAN_POOL
    return HUMAN_POOL


new_edges = list(existing)
seen = set(edges.keys())

for major in majors:
    mid = major["id"]
    pool = [u for u in pool_for(major) if u in uni_by_id]
    pool.sort(key=lambda u: hashlib.md5((mid + u).encode()).hexdigest())
    target = 10 if major["category"] in ("공학계열", "사회계열", "예체능계열") else 8
    cur = sum(1 for (m, _) in seen if m == mid)
    if cur >= target:
        continue
    need = target - cur
    for uid in pool:
        if (mid, uid) in seen:
            continue
        h = int(hashlib.md5((mid + uid).encode()).hexdigest(), 16) % 100
        quota = 30 + h  # 30~129
        new_edges.append({"majorId": mid, "universityId": uid, "admissionQuota": quota})
        seen.add((mid, uid))
        need -= 1
        if need == 0:
            break

new_edges.sort(key=lambda e: (e["majorId"], e["universityId"]))
json.dump(new_edges, open("seed/university_majors.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"university_majors edges: {len(new_edges)}")
per_major = Counter(e["majorId"] for e in new_edges)
print(f"학과당 평균 매핑 대학: {sum(per_major.values())/len(per_major):.1f}개")
under = [m for m, c in per_major.items() if c < 5]
if under:
    print(f"5개 미만 학과({len(under)}): {under[:8]}")
else:
    print("5개 미만 학과: 없음")
