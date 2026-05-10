import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-xl font-bold">페이지를 찾을 수 없어요</h2>
      <p className="text-sm text-muted-foreground">
        주소가 잘못되었거나 삭제된 페이지일 수 있어요.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
