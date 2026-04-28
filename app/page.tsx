import { TodoApp } from "@/components/todo/todo-app";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center p-8">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Todo</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            오늘 해야 할 일을 기록하세요
          </p>
        </div>
        <TodoApp />
        <p className="text-muted-foreground text-center text-xs">
          <kbd>d</kbd> 키로 다크 모드 전환
        </p>
      </div>
    </div>
  );
}
