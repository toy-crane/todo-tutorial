"use client";

import { Button } from "@/components/ui/button";

interface TodoOptionGroupProps<T extends string> {
  ariaLabel: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * 라디오그룹 형태의 버튼 목록을 렌더링하는 공용 컴포넌트.
 * 필터/정렬/카테고리 필터처럼 "옵션 중 하나를 선택"하는 UI가 반복되어 추출했다.
 */
export function TodoOptionGroup<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: TodoOptionGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex gap-1">
      {options.map((item) => {
        const selected = item.value === value;
        return (
          <Button
            key={item.value}
            type="button"
            size="sm"
            variant={selected ? "default" : "outline"}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
