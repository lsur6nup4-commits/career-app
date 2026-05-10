import { getQuestionsBundle } from "@/lib/diagnosis/scoring";
import { DiagnosisRunner } from "@/components/diagnosis/diagnosis-runner";

export const metadata = {
  title: "진로 진단 진행 — 진로나침반",
};

export default function DiagnosisRunPage() {
  const bundle = getQuestionsBundle();
  return <DiagnosisRunner bundle={bundle} />;
}
