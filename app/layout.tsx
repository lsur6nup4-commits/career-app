import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CompareBar } from "@/components/major/compare-bar";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { InterestBadge } from "@/components/interests/interest-badge";
import "./globals.css";

export const metadata: Metadata = {
  title: "진로나침반 — 한국 고등학생 진로 탐색",
  description:
    "한국 고등학생을 위한 학과 추천 진단, 학과 백과사전, AI 진로 상담 서비스",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5B5BD6" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F1A" },
  ],
};

// Run before React hydration to set the theme — prevents FOUC.
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`.trim();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          본문으로 건너뛰기
        </a>

        <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link
              href="/"
              className="text-base font-bold tracking-tight"
              aria-label="진로나침반 홈"
            >
              <span className="text-primary">진로</span>나침반
            </Link>
            <nav
              aria-label="페이지 메뉴"
              className="hidden items-center gap-1 text-sm md:flex"
            >
              <Link
                href="/diagnosis"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                진단
              </Link>
              <Link
                href="/career-type"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                유형검사
              </Link>
              <Link
                href="/majors"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                학과 탐색
              </Link>
              <Link
                href="/jobs"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                직업 탐색
              </Link>
              <Link
                href="/universities"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                대학 탐색
              </Link>
              <Link
                href="/chat"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                AI 상담
              </Link>
              <Link
                href="/my"
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-foreground"
              >
                내 노트
              </Link>
              <InterestBadge />
              <ThemeToggle className="ml-1" />
            </nav>
            <div className="flex items-center gap-2 md:hidden">
              <InterestBadge />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main-content" className="container py-6 pb-32 md:pb-24">
          {children}
        </main>

        <CompareBar />
        <BottomTabBar />

        <footer className="hidden border-t border-border bg-card md:block">
          <div className="container py-6 text-xs text-muted-foreground">
            진로나침반 · MVP · 데이터는 학습용 샘플입니다
          </div>
        </footer>
      </body>
    </html>
  );
}
