"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { runPresets } from "@/lib/run-presets";

export function EventPresetField({
  presetId,
  title,
  onPresetChange,
  onTitleChange,
}: {
  presetId: string;
  title: string;
  onPresetChange: (presetId: string) => void;
  onTitleChange: (title: string) => void;
}) {
  const normalizedTitle = title.trim().toLowerCase();
  const filteredPresets = normalizedTitle
    ? runPresets.filter((preset) =>
        preset.label.toLowerCase().includes(normalizedTitle),
      )
    : runPresets;

  return (
    <label className="grid gap-2 text-xs" htmlFor="title">
      <span className="font-medium">Race title</span>
      <input name="presetId" type="hidden" value={presetId} />
      <Combobox
        inputValue={title}
        itemToStringLabel={(itemValue) =>
          runPresets.find((preset) => preset.id === itemValue)?.label ?? ""
        }
        value={presetId || null}
        onInputValueChange={onTitleChange}
        onValueChange={(nextPresetId) => onPresetChange(nextPresetId ?? "")}
      >
        <ComboboxInput
          className="h-11 rounded-2xl border bg-card/70 text-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25"
          id="title"
          name="title"
          placeholder="Find your race or type a custom title"
          required
          showClear
        />
        <ComboboxContent className="rounded-2xl">
          <ComboboxList>
            {filteredPresets.length > 0 ? (
              filteredPresets.map((preset) => (
                <ComboboxItem key={preset.id} value={preset.id}>
                  {preset.label}
                </ComboboxItem>
              ))
            ) : (
              <div className="px-4 py-3 text-muted-foreground text-sm">
                No matching races. Keep typing to use a custom title.
              </div>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </label>
  );
}
