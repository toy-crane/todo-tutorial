import { TodoApp } from "@/components/todo-app"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 p-6 pt-16">
      <TodoApp />
    </main>
  )
}
