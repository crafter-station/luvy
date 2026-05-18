"use client";

import { CalendarBlankIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { EventPresetField } from "@/components/event-preset-field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runPresets } from "@/lib/run-presets";

function dateFromFieldValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function fieldValueFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatRaceDate(value: string) {
  const date = dateFromFieldValue(value);

  if (!date) {
    return "Pick a date";
  }

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function RunCreateForm({
  action,
  defaultTimezone,
  timezones,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultTimezone: string;
  timezones: string[];
}) {
  const [presetId, setPresetId] = useState("");
  const [title, setTitle] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [raceTime, setRaceTime] = useState("");
  const [location, setLocation] = useState("");
  const [raceTimezone, setRaceTimezone] = useState(defaultTimezone);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  function selectPreset(nextPresetId: string) {
    setPresetId(nextPresetId);

    const preset = runPresets.find((item) => item.id === nextPresetId);

    if (!preset) {
      return;
    }

    setTitle(preset.title);
    setRaceDate(preset.raceDate);
    setRaceTime(preset.raceTime);
    setLocation(preset.location);
    setRaceTimezone(preset.raceTimezone);
  }

  function changeTitle(nextTitle: string) {
    setTitle(nextTitle);

    const preset = runPresets.find((item) => item.title === nextTitle);
    setPresetId(preset?.id ?? "");

    if (!preset) {
      return;
    }

    setRaceDate(preset.raceDate);
    setRaceTime(preset.raceTime);
    setLocation(preset.location);
    setRaceTimezone(preset.raceTimezone);
  }

  return (
    <form action={action} className="grid gap-5">
      <EventPresetField
        presetId={presetId}
        title={title}
        onPresetChange={selectPreset}
        onTitleChange={changeTitle}
      />

      <div className="grid grid-cols-1 gap-3">
        <div className="grid gap-2">
          <label className="text-xs font-medium" htmlFor="raceDate">
            Race date
          </label>
          <input name="raceDate" type="hidden" value={raceDate} />
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              render={
                <Button
                  className="h-11 justify-start rounded-2xl border bg-card/70 px-4 font-normal text-sm"
                  id="raceDate"
                  type="button"
                  variant="outline"
                />
              }
            >
              <CalendarBlankIcon data-icon="inline-start" />
              {formatRaceDate(raceDate)}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto rounded-2xl p-0">
              <Calendar
                captionLayout="dropdown"
                mode="single"
                selected={dateFromFieldValue(raceDate)}
                onSelect={(date) => {
                  if (!date) {
                    return;
                  }

                  setRaceDate(fieldValueFromDate(date));
                  setDatePickerOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Field className="w-32">
          <FieldLabel htmlFor="raceTime">Race time</FieldLabel>
          <Input
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            id="raceTime"
            name="raceTime"
            required
            step="1"
            type="time"
            value={raceTime}
            onChange={(event) => setRaceTime(event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-medium" htmlFor="location">
          Location
        </label>
        <Input
          id="location"
          name="location"
          placeholder="Lima, Peru"
          required
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>

      <label className="grid gap-2 text-xs" htmlFor="raceTimezone">
        <span className="font-medium">Timezone</span>
        <input name="raceTimezone" type="hidden" value={raceTimezone} />
        <Select
          value={raceTimezone}
          onValueChange={(nextTimezone) => setRaceTimezone(nextTimezone ?? "")}
        >
          <SelectTrigger
            className="h-11 w-full rounded-2xl border bg-card/70 px-4 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
            id="raceTimezone"
          >
            <SelectValue placeholder="Choose timezone" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectGroup>
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </label>

      <Button size="lg" type="submit">
        Create race page
      </Button>
    </form>
  );
}
