/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ─────────────────────────────────────────────────────────────
  // 정적 HTML 내보내기 (Static Export)를 원할 때 아래 두 줄을 활성화하세요.
  //
  // ⚠️ 활성화 시 제약:
  //  - /api/chat (Claude SSE 엔드포인트)이 동작하지 않습니다 — Route Handler는
  //    Node 런타임이 필요해 정적 HTML로 변환되지 않습니다.
  //  - 챗봇을 살리려면 별도 서버(Cloudflare Workers, Lambda, Render 등)에
  //    /api/chat만 호스팅하고 클라이언트 fetch URL을 그쪽으로 바꾸세요.
  //  - 진단/학과/로드맵/비교/내노트 등 나머지 페이지는 모두 정적 export 정상 동작.
  //
  // 자세한 설명: ./DEPLOYMENT.md
  // ─────────────────────────────────────────────────────────────
  // output: "export",
  // images: { unoptimized: true },
};

export default nextConfig;
