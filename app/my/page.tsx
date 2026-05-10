import { MyView } from "@/components/my/my-view";

export const metadata = {
  title: "내 노트 — 진로나침반",
};

export default function MyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">내 노트</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          진단 결과·북마크한 학과·진로 메모를 한 곳에서 관리해보세요.
        </p>
      </div>
      <MyView />
    </div>
  );
}
