import { MagnifyingGlass } from "@phosphor-icons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type Props = {
  value: string;
  onChange: (q: string) => void;
};

export function TodoSearch({ value, onChange }: Props) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <MagnifyingGlass />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        role="searchbox"
        aria-label="검색"
        placeholder="제목으로 검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
