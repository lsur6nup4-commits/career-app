# 향후 개선 로드맵 (ROADMAP.md)

현재 [README.md](./README.md)에 정리된 기능이 MVP 완성본이고, 다음 단계는 **데이터의 신뢰도와 운영 가능성**을 높이는 작업입니다.

| 우선순위 | 항목 | 예상 기간 |
|---|---|---|
| 🔴 높음 | DB 연동 (Supabase) + 사용자 인증 | 2~3주 |
| 🔴 높음 | 공공 API 연동 (커리어넷 / 대학알리미) | 2주 |
| 🟡 중간 | 관리자 페이지 (콘텐츠 CMS) | 2주 |
| 🟡 중간 | PWA 변환 + 푸시 알림 | 1~2주 |
| 🟢 낮음 | React Native(Expo) 모바일 앱 | 4주+ |

---

## 1. DB 연동 — Supabase 권장 🔴

현재 모든 사용자 데이터(진단·북마크·메모·채팅)는 **브라우저 localStorage**에 저장됩니다. 다른 기기와 동기화되지 않고, 브라우저 캐시를 비우면 사라집니다.

### 왜 Supabase인가
- Postgres 기반(이미 설계 문서의 스키마 그대로 적용 가능)
- Auth + Storage + Realtime이 한 패키지
- 무료 티어가 넉넉(500MB DB, 50K MAU)
- Next.js App Router + Server Component와 궁합이 좋음
- Row-Level Security로 학생 데이터 격리가 쉬움

### 작업 순서
1. **`prisma/schema.prisma` 작성** — [design.md §4](../design.md)의 스키마 그대로 옮기면 됨
   - `User`, `DiagnosisResult`, `DiagnosisAnswer`, `Bookmark`, `Note`, `RoadmapItem`, `ChatSession`, `ChatMessage`
2. **시드 마이그레이션** — `seed/*.json`을 일회성 스크립트로 DB에 적재
3. **데이터 액세스 레이어 교체** — `lib/majors.ts`, `lib/diagnosis/scoring.ts`가 Prisma client 호출하도록
4. **클라이언트 → 서버 마이그레이션** — Zustand persist 대신 TanStack Query + `/api/*` 호출
5. **localStorage 마이그레이션** — 기존 사용자의 localStorage를 한 번 서버로 동기화하는 helper
6. **RLS 정책** — `auth.uid() = user_id` 규칙으로 학생 본인 데이터만 접근

### 참고
- Supabase 가이드: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Prisma + Supabase: https://supabase.com/partners/integrations/prisma

---

## 2. 사용자 인증 🔴

**필수 기능**: 카카오·구글 OAuth (한국 학생 친숙도 우선)

### 권장 스택: NextAuth.js (Auth.js v5)
- Supabase Auth와 연동하는 어댑터 존재
- 게스트 모드 유지 (진단·학과 탐색은 비로그인 가능)
- "결과 저장하려면 로그인" 트리거를 진단 결과 화면에 자연스럽게 노출

### 미성년자 대응 (반드시 검토)
- 만 14세 미만은 보호자 동의 필수 (개인정보보호법 §22)
- 학교 계정 연동 옵션 검토 (NEIS 또는 학교 전용 SSO)
- 가입 시 최소 정보만 수집: 닉네임 + 학년 (학교명·연락처는 옵션)

---

## 3. 공공 API 연동 🔴

현재 학과 정보·연봉·취업률은 모두 **placeholder**입니다 ([seed/major_extras.json](./seed/major_extras.json) `_note` 참고). 실제 데이터로 교체하면 신뢰도가 비약적으로 올라갑니다.

### 우선순위 데이터 소스
| 데이터 | 출처 | API |
|---|---|---|
| 학과별 평균 연봉·취업률 | 한국직업능력연구원 **커리어넷** | https://www.career.go.kr/inspct/web/openapi/openApiPmsManage |
| 대학별 모집 정원·전형 | 교육부 **대학알리미** | https://www.academyinfo.go.kr/openapi |
| 학과 분류 표준 | 한국교육개발원 KEDI | https://kess.kedi.re.kr |
| 직업 정보 | **워크넷** Open API | https://www.work24.go.kr/cm/openApi |
| 자격증 | 한국산업인력공단 Q-Net | https://www.q-net.or.kr |

### 작업 순서
1. API 키 발급 (모두 무료, 일부 사용 신청 필요)
2. `lib/external/` 폴더 생성 + 각 API 어댑터 작성
3. 일/주간 배치 잡으로 DB 캐시 (실시간 호출은 비용·속도 모두 부담)
4. 데이터 출처 푸터 표시 (법적·윤리적 의무)

---

## 4. 관리자 페이지 (콘텐츠 CMS) 🟡

학과 보강 데이터·선배 인터뷰·추천 활동을 **개발자 코드 수정 없이** 운영진이 추가할 수 있는 백오피스가 필요합니다.

### 옵션
- **Self-hosted (Next.js 내부 페이지)**: `/admin/*` 라우트 + Auth 가드. 가장 통제 강함
- **Sanity / Contentful / Strapi**: Headless CMS 외부 연동. 빠르게 시작 가능
- **Supabase Studio**: 단순 CRUD라면 별도 페이지 없이 Supabase 대시보드만 써도 충분

### 관리할 콘텐츠
- 학과 보강 데이터 (현재 9개 필드)
- 선배 인터뷰 (학교·학과·경험담)
- 추천 활동 (동아리·대회·봉사 + 학과 매핑)
- 자기소개서 문항 템플릿 (v2 자기소개서 도우미용)

---

## 5. PWA 변환 + 푸시 알림 🟡

현재도 모바일 우선 디자인이지만, 홈 화면에 추가해 네이티브처럼 쓸 수 있게 만들면 리텐션이 크게 개선됩니다.

### 작업 항목
- `next-pwa` 또는 Next.js 자체 PWA 설정
- `public/manifest.json` 작성 (이름·아이콘·테마 컬러는 이미 디자인 토큰에 있음)
- 서비스 워커 (오프라인 캐시: 학과 백과사전 + 북마크 한정)
- 앱 설치 프롬프트 UI

### 푸시 알림 사용 사례
- 모집 마감 D-7 알림 (북마크한 학과)
- 진단 후 일정 기간이 지나면 "재진단 권유"
- 새로운 학과·콘텐츠 추가 알림
- 채팅 응답 도착 알림 (현재는 페이지에 머물러야 받음)

### 권장 도구
- Push: Web Push API + VAPID 키
- 모바일 OS 푸시: PWA로는 iOS 16.4+ 이상부터 가능, 안드로이드는 안정적

---

## 6. 사용자 가치 추가 기능 🟡

### 자기소개서 도우미 (설계 문서 기능 #10)
- 학과 선택 → 문항 템플릿 → 사용자 작성 → AI 단락별 피드백
- 시스템 프롬프트에 "사실 추가는 금지, 표현·구조 제안만" 명시 (학생 작성물 변조 방지)

### 또래 그룹 학과 통계
- "고2 같은 진단 결과 학생들은 어떤 학과를 많이 봤어요?"
- 익명 집계 + k-anonymity 보장

### 학부모/교사 공유
- 진단 결과·로드맵을 읽기 전용 링크로 공유
- 공유 링크에는 개인정보 마스킹

---

## 7. 인프라 / DX 개선 🟢

### 모니터링
- Sentry — 클라이언트·서버 에러 통합
- Vercel Analytics — 페이지뷰·CVR
- Anthropic 사용량 대시보드 — 토큰·비용 추적

### Anthropic 비용 최적화
- **시스템 프롬프트 캐싱** (`cache_control: ephemeral`) → 같은 진단 결과 컨텍스트 재사용 시 토큰 90% 절감
- 사용자별 일일 메시지 limit (Redis + sliding window)
- 짧은 응답 권장 시스템 프롬프트 강화

### 테스트
- Vitest + React Testing Library (점수 산출 알고리즘 단위 테스트)
- Playwright E2E (진단 전체 흐름 + 챗봇 한 사이클)
- Visual regression (Chromatic 또는 Percy)

---

## 8. React Native(Expo) 네이티브 앱 🟢

PWA로 충분하다면 우선순위 낮지만, 학교 일괄 배포·앱스토어 노출이 필요해지면 검토.
- Expo Router로 라우트 구조 거의 그대로 이식 가능
- 진단 UI / 학과 백과사전은 React Native Paper로 빠르게 포팅
- 챗봇 SSE는 React Native에서 fetch 폴리필 또는 EventSource 라이브러리 필요

---

## 기여 환영 🙌

위 항목 중 잡아보고 싶은 게 있다면 GitHub Issues에 공유해주세요. 작은 기여라도 환영합니다 — 시드 데이터 한 학과 보강, 추천 도서 한 권 추가, 버그 리포트 모두 좋습니다.
