import { act } from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { TodoApp } from "@/components/todo-app"

// 서버에는 window가 없다. window를 잠시 없앤 채로 렌더링해 서버 HTML을 흉내 낸다
function renderOnServer() {
  vi.stubGlobal("window", undefined)
  try {
    return renderToString(<TodoApp />)
  } finally {
    vi.unstubAllGlobals()
  }
}

describe("TodoApp hydration", () => {
  let container: HTMLDivElement | null = null

  afterEach(() => {
    container?.remove()
    container = null
  })

  it("서버 HTML과 브라우저 첫 렌더링이 같아 hydration 에러가 나지 않는다", async () => {
    const html = renderOnServer()
    container = document.createElement("div")
    container.innerHTML = html
    document.body.appendChild(container)

    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      root = hydrateRoot(container!, <TodoApp />, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    // hydration 뒤에는 브라우저 기준으로 안내 문구가 보인다
    expect(container.textContent).toContain("할 일은 이 브라우저에 저장됩니다")

    act(() => root?.unmount())
  })
})
