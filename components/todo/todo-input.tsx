import { useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  onAdd: (text: string) => void;
};

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAdd(value);
      setValue("");
    }
  }

  return (
    <Input
      placeholder="할 일을 입력하고 Enter 를 누르세요"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
