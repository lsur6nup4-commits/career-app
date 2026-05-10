import Link from "next/link";
import { MessageCircle } from "lucide-react";

const QUESTIONS = [
  "내 적성에 맞는 직업은?",
  "수시와 정시, 어느 쪽이 유리할까요?",
  "고2 때부터 어떤 활동을 하면 좋을까요?",
  "관심 학과가 두 개일 때 어떻게 결정하나요?",
  "자기소개서는 언제부터 준비하나요?",
  "이공계 vs 인문계, 적성 어떻게 알 수 있나요?",
];

export function PopularQuestions() {
  return (
    <section aria-labelledby="popq-heading">
      <div className="mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
          <MessageCircle className="h-3.5 w-3.5" /> AI 상담사에게
        </div>
        <h2 id="popq-heading" className="mt-0.5 text-lg font-bold tracking-tight">
          요즘 학생들이 많이 묻는 질문
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {QUESTIONS.map((q) => (
          <li key={q}>
            <Link
              href={`/chat?q=${encodeURIComponent(q)}`}
              className="flex h-full items-start gap-2 rounded-lg border border-border bg-card p-3.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                Q
              </span>
              <span className="flex-1 leading-relaxed text-foreground/85">{q}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
