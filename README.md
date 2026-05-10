# 진로나침반 (Career Compass)

> 한국 고등학생을 위한 모바일-우선 진로 탐색 웹앱.
> Holland 기반 진단 → 학과 백과사전 → AI 진로 상담을 한 곳에서.

[![Made with Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 📌 프로젝트 소개

학생들은 자신이 무엇을 좋아하는지, 어떤 학과가 잘 맞는지, 그 학과를 졸업하면 무엇을 할 수 있는지 아는 데 너무 많은 시간이 듭니다.
**진로나침반**은 5분 안에 자신의 성향을 파악하고, 30개 학과의 커리큘럼·입시·졸업 후 진로를 한눈에 비교하고, 막히면 AI 상담사에게 즉시 물어볼 수 있는 모바일-우선 진로 가이드입니다.

> 설계 문서는 루트의 [design.md](../design.md), 향후 계획은 [ROADMAP.md](./ROADMAP.md), 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

---

## ✨ 주요 기능

### 1. Holland 기반 진로 진단 (`/diagnosis`)
- 5분, 32문항 (Holland 6유형 × 5문항 + 좋아하는 과목 + 관심 분야 멀티셀렉)
- 자동 저장 → 중간에 나가도 이어서 진행
- 결과: Holland 6각형 차트 + 추천 학과 Top 10 (적합도 점수 + "왜 추천?" 사유)

### 2. 30개 학과 백과사전 (`/majors`, `/majors/[id]`)
검색·계열 필터, 학과 상세는 5개 탭으로 정리:
| 탭 | 내용 |
|---|---|
| 커리큘럼 | 1~4학년 대표 과목 + 한 줄 설명 |
| 졸업 후 진로 | 직업 6~7개(평균 연봉) + 취업 분야 도넛 차트 + 자격증 + 대학원 옵션 |
| 산업 현황 | 트렌드 + 향후 전망 배지(성장/유지/축소/변화) + 키워드 |
| 추천 활동 | 동아리/대회/봉사/프로젝트/독서 + 추천 도서 |
| 개설 대학 | 대학별 정원·지역 |

### 3. AI 진로 상담 챗봇 (`/chat`)
- Anthropic Claude `claude-sonnet-4-5`, SSE 스트리밍 응답
- 진단 결과를 시스템 프롬프트에 자동 주입(개인화)
- 인기 질문 빠른 진입 칩, 한국어 IME 안전한 Enter, 중지/재시작
- 홈 인기 질문 카드 → `/chat?q=...`로 입력창 자동 채움

### 4. 학과 비교 (`/compare`)
- 카드의 "비교 담기" 버튼으로 최대 3개까지 모음 (Zustand persist)
- 화면 하단 sticky 비교 바 → "비교하기" → 적합도·키워드·대표직업·평균연봉·산업전망 한눈 비교

### 5. 북마크 + 진로 노트 (`/my`)
- 학과 상세 ★ 북마크
- 학과별 자유 메모 (자동 저장)
- 진단 결과 요약 + 북마크 학과 + 로드맵 진입 카드

### 6. 진로 로드맵 (`/roadmap/[majorId]`)
- 고1 → 고2 → 고3 → 입시 → 대학 1~4학년 → 졸업 후 9단계 세로 타임라인
- 학과별 데이터를 자동 조합(추천 활동·평균 등급·수시/정시 비율·커리큘럼·대표 직업)

### 디자인 / UX
- 부드러운 인디고/바이올렛 + 코랄 포인트 컬러
- **다크 모드** (시스템 prefer 자동, localStorage 저장)
- Pretendard Variable 폰트로 한글 가독성
- 모바일 하단 탭바(홈/진단/학과/상담/마이) + 데스크톱 헤더 nav
- Empty/Loading/Error 상태 일관 컴포넌트
- 시맨틱 태그·스킵 링크·`aria-label`·키보드 포커스 링

---

## 🛠 기술 스택

| 영역 | 도구 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) + React 19 |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS 3 (CSS 변수 토큰 기반 라이트/다크) |
| 상태 관리 | Zustand (persist) |
| 차트 | Recharts |
| AI | Anthropic SDK (`claude-sonnet-4-5`), SSE 스트리밍 |
| 폰트 | Pretendard Variable (CDN) |
| 아이콘 | Lucide React |
| 데이터 | JSON 시드 (학과 30 + 대학 21 + 학과↔대학 매핑 100+ + 보강 9필드 × 30) |

---

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js **18 이상** (권장 20+)
- npm (또는 pnpm/yarn)

### 1. 의존성 설치
```bash
cd career-app
npm install
```

### 2. 환경 변수 설정 (AI 챗봇 사용 시 필요)

```bash
cp .env.local.example .env.local
# .env.local 열어서 ANTHROPIC_API_KEY 값을 본인 키로 교체
```

API 키 발급 방법:
1. https://console.anthropic.com/settings/keys 접속
2. "Create Key" → 복사 (`sk-ant-...`로 시작)
3. 결제 수단이 없으면 [Billing 페이지](https://console.anthropic.com/settings/billing)에서 등록

> 키 없이도 진단·학과 탐색·비교·로드맵 등 모든 기능이 동작합니다.
> 챗봇 페이지에서만 안내 메시지가 표시됩니다.

### 3. 개발 서버
```bash
npm run dev
# → http://localhost:3000
```

### 4. 프로덕션 빌드
```bash
npm run build
npm run start
```

### 5. 린트
```bash
npm run lint
```

---

## 🗺 라우트

| 경로 | 설명 | 렌더링 |
|---|---|---|
| `/` | 홈 — 히어로 + 추천 학과 캐러셀 + 인기 질문 | Static |
| `/diagnosis` | 진단 인트로 | Static |
| `/diagnosis/run` | 32단계 진단 진행 (자동 저장) | Static |
| `/diagnosis/result` | Holland 6각형 + 추천 학과 Top 10 | Static |
| `/majors` | 학과 검색·필터 | Static |
| `/majors/[id]` | 학과 상세 (5탭) | SSG (30개) |
| `/compare` | 학과 비교 (최대 3개) | Static |
| `/my` | 북마크 + 진단 요약 + 메모 | Static |
| `/roadmap/[id]` | 진로 로드맵 타임라인 | SSG (30개) |
| `/chat` | AI 상담 챗봇 | Static (UI) |
| `/api/chat` | Claude SSE 스트리밍 엔드포인트 | Dynamic (Node) |

---

## 📁 폴더 구조

```
career-app/
├─ app/                          # Next.js App Router 페이지
│  ├─ api/chat/                  # SSE 챗봇 라우트
│  ├─ diagnosis/                 # 진단 인트로/진행/결과
│  ├─ majors/                    # 학과 목록/상세
│  ├─ compare/                   # 학과 비교
│  ├─ my/                        # 내 노트
│  ├─ roadmap/[id]/              # 진로 로드맵
│  ├─ chat/                      # AI 상담
│  ├─ layout.tsx                 # 루트 레이아웃 (헤더+탭바+테마)
│  └─ globals.css                # CSS 변수, Pretendard
├─ components/
│  ├─ ui/                        # Button, Card, Badge, Input, EmptyState, Skeleton
│  ├─ layout/                    # ThemeToggle, BottomTabBar
│  ├─ diagnosis/                 # 진단 컴포넌트 (Likert, MultiSelect, Radar, ...)
│  ├─ chat/                      # 채팅 UI (Bubble, Typing, QuickQuestions)
│  ├─ major/                     # 학과 검색/탭/비교/북마크/비교바
│  ├─ home/                      # 홈 캐러셀, 인기 질문
│  ├─ my/                        # 마이 페이지 뷰
│  └─ roadmap/                   # 로드맵 타임라인
├─ lib/
│  ├─ diagnosis/                 # 점수 산출, 매핑, storage
│  ├─ chat/                      # 시스템 프롬프트, storage
│  ├─ roadmap.ts                 # 로드맵 단계 빌더
│  ├─ majors.ts                  # 학과 데이터 로더 (시드 + 보강)
│  └─ utils.ts
├─ stores/                       # Zustand: compare, bookmark, useHydrated
├─ types/                        # major, diagnosis, chat
├─ seed/                         # JSON 시드 데이터
│  ├─ majors.json                # 학과 30개
│  ├─ universities.json          # 대학 21개
│  ├─ university_majors.json     # 학과↔대학 매핑
│  ├─ major_extras.json          # 학과 보강 (9필드 × 30)
│  ├─ course_descriptions.json   # 230여 과목 한 줄 설명
│  └─ diagnosis_questions.json   # 진단 문항
├─ .env.local.example
├─ next.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 🔒 데이터 / 개인정보

- 모든 사용자 데이터(진단 결과·북마크·메모·채팅 히스토리)는 **브라우저 localStorage**에만 저장됩니다.
- 서버에 사용자 데이터를 저장하지 않습니다 (DB 미연동).
- AI 챗봇은 사용자 메시지 + 진단 결과를 Anthropic API로 전송합니다.
- 학과·대학·진로·연봉 데이터는 **학습용 placeholder**입니다 (`seed/major_extras.json`의 `_note` 참고). 실제 통계는 추후 [공공 API 연동](./ROADMAP.md)으로 대체될 예정입니다.

---

## 📜 라이선스

[MIT License](./LICENSE) © 2026 진로나침반 프로젝트
