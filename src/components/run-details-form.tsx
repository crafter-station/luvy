"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RunDetailsForm({
  action,
  defaultValues,
  runId,
  timezones,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues: {
    title: string;
    runSlug: string;
    raceDate: string;
    raceTime: string;
    raceTimezone: string;
    location: string;
  };
  runId: string;
  timezones: string[];
}) {
  const [raceTimezone, setRaceTimezone] = useState(defaultValues.raceTimezone);

  return (
    <form action={action} className="grid gap-5">
      <input name="runId" type="hidden" value={runId} />

      <Field>
        <FieldLabel htmlFor="title">Race name</FieldLabel>
        <Input
          id="title"
          name="title"
          required
          defaultValue={defaultValues.title}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="runSlug">Race link slug</FieldLabel>
        <Input
          autoComplete="off"
          id="runSlug"
          name="runSlug"
          required
          defaultValue={defaultValues.runSlug}
        />
      </Field>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <Field>
          <FieldLabel htmlFor="raceDate">Race date</FieldLabel>
          <Input
            id="raceDate"
            name="raceDate"
            required
            type="date"
            defaultValue={defaultValues.raceDate}
          />
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor="raceTime">Race time</FieldLabel>
          <Input
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            id="raceTime"
            name="raceTime"
            required
            step="1"
            type="time"
            defaultValue={defaultValues.raceTime}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <Input
          id="location"
          name="location"
          required
          defaultValue={defaultValues.location}
        />
      </Field>

      <label className="grid gap-2 text-xs" htmlFor="raceTimezone">
        <span className="font-medium">Timezone</span>
        <input name="raceTimezone" type="hidden" value={raceTimezone} />
        <Select
          value={raceTimezone}
          onValueChange={(nextTimezone) => {
            if (nextTimezone) {
              setRaceTimezone(nextTimezone);
            }
          }}
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

      <p className="text-muted-foreground text-xs leading-5">
        Changing the slug changes this race page link. Old links will stop
        working, so reshare the new link after saving.
      </p>

      <Button className="w-fit" type="submit">
        Save race details
      </Button>
    </form>
  );
}
