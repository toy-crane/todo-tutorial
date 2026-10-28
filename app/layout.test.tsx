import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "@/app/layout";

// next/font/google은 Next 빌드 환경에서만 동작하므로 폰트 변수만 흉내 낸다.
vi.mock("next/font/google", () => {
  const font = () => ({ variable: "font-var", className: "font-class" });
  return { Geist_Mono: font, Nunito_Sans: font, Noto_Serif: font };
});
vi.mock("./globals.css", () => ({}));
// 테마 처리는 이 테스트의 관심사가 아니므로 children만 렌더링한다.
vi.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("RootLayout", () => {
  it("문서 언어를 한국어(ko)로 지정한다", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>본문</p>
      </RootLayout>
    );

    expect(html).toMatch(/<html[^>]*\slang="ko"/);
  });
});
