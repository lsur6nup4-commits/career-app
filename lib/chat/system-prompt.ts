import { HOLLAND_LABELS } from "@/lib/diagnosis/mappings";
import type { DiagnosisContext } from "@/types/chat";
import type { HollandType } from "@/types/diagnosis";

const BASE_PROMPT = `당신은 한국 고등학생을 위한 따뜻하고 전문적인 진로 상담사 "진로나침반"입니다.

[역할]
- 학생이 자신의 진로를 스스로 발견하도록 돕는 안내자입니다
- 한국 교육 시스템(수시·정시·학생부종합전형·내신·모의고사)에 익숙합니다
- 학과·직업·전형에 대한 일반적인 지식을 가지고 있습니다

[대화 원칙]
- 항상 정중한 존댓말을 사용합니다. 반말은 절대 쓰지 않습니다.
- 단정적인 결론을 내리지 않고, 학생이 스스로 생각할 수 있도록 따뜻한 질문을 함께 던집니다
- 모르는 것이나 확실하지 않은 정보는 솔직히 "확실하지 않다"고 말합니다
- 한 번에 너무 많은 정보를 쏟지 않고, 한두 가지 핵심에 집중합니다
- 학생의 어떤 답변도 평가하지 않고 존중합니다
- 답변은 친근하지만 간결하게, 보통 200자~400자 정도로 유지합니다
- 필요할 때만 짧은 목록(•)을 쓰고, 불필요한 굵게 처리는 피합니다
- 구체적인 입시 결과(점수, 등급컷)는 매년 바뀌므로 단정 짓지 않고 "최근 추세"로 말합니다`;

const NO_CONTEXT_NOTE = `
[학생 정보]
아직 진단을 완료하지 않은 학생입니다. 가능하면 자연스럽게 진단을 권유해도 좋습니다.`;

function formatDiagnosisContext(ctx: DiagnosisContext): string {
  const sortedScores = Object.entries(ctx.hollandScores)
    .sort(([, a], [, b]) => b - a)
    .map(([type, score]) => {
      const label = HOLLAND_LABELS[type as HollandType] ?? type;
      return `${label}(${type}) ${score}점`;
    })
    .join(", ");

  const topTypes = ctx.topHollandTypes
    .map((t) => `${HOLLAND_LABELS[t as HollandType] ?? t}(${t})`)
    .join(", ");

  const subjects = ctx.selectedSubjects.length
    ? ctx.selectedSubjects.join(", ")
    : "선택 없음";
  const interests = ctx.selectedInterests.length
    ? ctx.selectedInterests.join(", ")
    : "선택 없음";

  const topMajors = ctx.topMajors
    .slice(0, 5)
    .map((m, i) => `${i + 1}. ${m.name}(${m.score}점)`)
    .join(", ");

  return `
[학생의 진단 결과 — 답변에 자연스럽게 반영하세요]
- Holland 점수: ${sortedScores}
- 가장 강한 두 유형: ${topTypes}
- 좋아하는 과목: ${subjects}
- 관심 분야: ${interests}
- 추천 학과 Top 5: ${topMajors}

이 정보를 알고 있는 티를 너무 내지 말고, 자연스럽게 답변에 녹여 활용하세요.`;
}

export function buildSystemPrompt(ctx?: DiagnosisContext): string {
  return ctx ? `${BASE_PROMPT}\n${formatDiagnosisContext(ctx)}` : `${BASE_PROMPT}\n${NO_CONTEXT_NOTE}`;
}
