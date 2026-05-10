"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  GraduationCap,
  Home,
  MessageCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/diagnosis",
    label: "진단",
    icon: Compass,
    match: (p: string) => p.startsWith("/diagnosis"),
  },
  {
    href: "/majors",
    label: "학과",
    icon: GraduationCap,
    match: (p: string) =>
      p.startsWith("/majors") ||
      p.startsWith("/compare") ||
      p.startsWith("/roadmap"),
  },
  {
    href: "/chat",
    label: "상담",
    icon: MessageCircle,
    match: (p: string) => p.startsWith("/chat"),
  },
  { href: "/my", label: "마이", icon: User, match: (p: string) => p.startsWith("/my") },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-5 w-5", active && "stroke-[2.4]")}
                  aria-hidden="true"
                />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
