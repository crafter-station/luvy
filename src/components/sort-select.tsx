"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { label: "Newest first", value: "desc" },
  { label: "Oldest first", value: "asc" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export function SortSelect({
  value,
  onValueChange,
}: {
  value: SortValue;
  onValueChange: (value: SortValue) => void;
}) {
  return (
    <div className="grid text-xs">
      <Select
        items={sortOptions}
        value={value}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return;
          }

          onValueChange(nextValue);
        }}
      >
        <SelectTrigger className="h-10 rounded-full border-transparent bg-transparent px-3 font-medium shadow-none hover:bg-accent hover:text-accent-foreground dark:bg-transparent dark:hover:bg-accent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
