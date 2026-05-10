# 배포 가이드 (DEPLOYMENT.md)

진로나침반을 운영 환경에 올리는 방법을 정리했습니다. **가장 쉬운 길은 Vercel**이고, 정적 호스팅(Netlify, GitHub Pages, S3 등)도 가능하지만 챗봇 API에는 별도 서버가 필요합니다.

---

## 1. Vercel 배포 (권장 · 5분)

Next.js를 만든 회사라 가장 매끄럽습니다. 무료 Hobby 플랜으로 충분합니다.

### 사전 준비
- GitHub 계정 + 이 프로젝트를 푸시한 레포지토리
- [Vercel 계정](https://vercel.com/signup) (GitHub로 가입 권장)
- Anthropic API 키 (챗봇용)

### 단계
1. **레포지토리를 GitHub에 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/career-app.git
   git push -u origin main
   ```

2. **Vercel에 임포트**
   - https://vercel.com/new 접속 → "Import Git Repository" → 위 레포지토리 선택
   - **Root Directory**를 `career-app`으로 설정 (모노레포 구조이므로 중요)
   - Framework Preset: Next.js (자동 감지)
   - Build Command / Output Directory는 기본값 그대로

3. **환경 변수 등록** (배포 전 필수)
   "Environment Variables" 섹션에서:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (본인 키)
   - Environments: `Production`, `Preview`, `Development` 모두 체크
   - **주의**: `NEXT_PUBLIC_` 접두사를 절대 붙이지 마세요. 키가 클라이언트 번들에 노출됩니다.

4. **Deploy 클릭**
   - 1~2분 안에 `https://<project-name>.vercel.app`로 배포 완료
   - 이후 `git push` 한 번이면 자동 재배포됩니다 (Production = main, PR마다 Preview 배포)

5. **배포 후 동작 확인 체크리스트**
   - [ ] 홈에서 "5분 진단 시작하기" 클릭 → 진단 진행
   - [ ] 학과 상세에서 "비교 담기" → `/compare` 진입
   - [ ] AI 상담에 메시지 전송 → 스트리밍 응답
   - [ ] 다크모드 토글 동작
   - [ ] 모바일(390px)에서 하단 탭바 노출

### 환경 변수를 나중에 변경했다면
Vercel은 환경 변수가 바뀌면 **재배포**해야 반영됩니다.
- Vercel Dashboard → 프로젝트 → Deployments → 가장 최근 배포의 ⋯ → "Redeploy"

---

## 2. 커스텀 도메인 연결

### Vercel에서 도메인 추가
1. 프로젝트 → Settings → Domains → "Add" → `careercompass.kr` 입력
2. Vercel이 도메인 등록 업체에 추가할 DNS 레코드를 알려줍니다:
   - **Apex 도메인**(`careercompass.kr`): A 레코드 `76.76.21.21`
   - **www 서브도메인**: CNAME `cname.vercel-dns.com`
3. 본인의 DNS 호스트(가비아·후이즈·Cloudflare 등)에 위 레코드 추가
4. 5~30분 대기 → SSL 자동 발급 (Let's Encrypt)

### Cloudflare를 함께 쓸 때
- DNS 레코드의 "Proxy" 옵션을 **꺼두세요** (DNS only). 켜면 Vercel의 SSL 발급이 실패합니다.
- HTTPS는 Vercel이 알아서 처리합니다.

---

## 3. 정적 HTML로 내보내기 (Static Export)

Vercel을 못 쓰는 환경(사내 정적 호스팅, S3, Netlify Static, GitHub Pages 등)에서는 정적 HTML로 빌드할 수 있습니다.

### 활성화 방법
[`next.config.mjs`](./next.config.mjs)에서 주석 처리된 `output: "export"`를 켭니다:

```js
const nextConfig = {
  reactStrictMode: true,
  output: "export",        // 활성화
  images: { unoptimized: true },
};
```

빌드:
```bash
npm run build
# → out/ 폴더에 정적 HTML이 생성됨
```

`out/` 폴더 전체를 정적 호스팅에 업로드하면 됩니다.

### ⚠️ 정적 export의 제약 (반드시 확인)
- **AI 챗봇(`/api/chat`)이 동작하지 않습니다.** Route Handler는 Node 런타임이 필요해서 정적 HTML로 변환되지 않습니다.
- 챗봇을 살리려면 두 가지 중 하나:
  1. **하이브리드**: 정적 호스팅 + 별도 서버에 `/api/chat`만 호스팅 (Cloudflare Workers, AWS Lambda, Render, Fly.io 등) → 클라이언트 fetch URL을 절대 경로로 변경
  2. **풀 스택 호스팅 사용**: 그냥 Vercel/Netlify Functions/Render 권장 (가장 단순)
- `loading.tsx`, `error.tsx`, 동적 라우트도 일부 동작이 달라집니다 ([공식 문서](https://nextjs.org/docs/app/guides/static-exports#unsupported-features))
- 진단·학과·로드맵 페이지는 모두 SSG라 정적 export에서도 잘 동작합니다.

---

## 4. 다른 배포 옵션 (간략)

| 플랫폼 | 적합도 | 메모 |
|---|---|---|
| **Vercel** | ★★★★★ | Next.js 공식. API 라우트·이미지 최적화·SSG 모두 자동 |
| **Netlify** | ★★★★☆ | Functions로 `/api/chat` 동작. Next.js 어댑터 필요 |
| **Cloudflare Pages** | ★★★☆☆ | Workers 어댑터 필요. Edge 환경 제약 있음 |
| **Render / Fly.io** | ★★★☆☆ | Node 서버로 `npm run start`. 비용은 $0~$10/월 |
| **자체 서버 (Docker)** | ★★☆☆☆ | `Dockerfile` 직접 작성 필요. 자유도 최고 |
| **GitHub Pages** | ★★☆☆☆ | 정적 export만 가능. 챗봇 별도 서버 필요 |

### Docker 예시 (자체 서버용)
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 5. 배포 전 마지막 체크리스트

- [ ] `npm run build` 로컬 통과
- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 (저장소에 키가 새지 않도록)
- [ ] `ANTHROPIC_API_KEY`를 호스팅 환경 변수에 등록
- [ ] 학과·연봉 등 placeholder 데이터에 대한 면책 문구가 페이지에 노출되는지 (`seed/major_extras.json`의 `_note`)
- [ ] (선택) Sentry / Vercel Analytics 등 모니터링 연결
- [ ] (선택) 사용량 폭증 대비 — Anthropic API에 일일 사용량 제한 설정 또는 자체 rate-limit 도입

---

문제가 생기면 [GitHub Issues]에 올려주세요. 기여 환영합니다.
