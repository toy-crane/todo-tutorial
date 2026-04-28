import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (q: string) => void;
};

export function TodoSearch({ value, onChange }: Props) {
  return (
    <Input
      type="search"
      role="searchbox"
      aria-label="검색"
      placeholder="제목으로 검색"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
