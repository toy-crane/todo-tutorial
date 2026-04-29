import { TodoApp } from "@/components/todo/todo-app";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center p-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Todo</CardTitle>
            <CardDescription>오늘 해야 할 일을 기록하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <TodoApp />
          </CardContent>
        </Card>
        <p className="text-muted-foreground text-center text-xs">
          <Kbd>d</Kbd> 키로 다크 모드 전환
        </p>
      </div>
    </div>
  );
}
