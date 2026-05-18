const fallbackTimezones = [
  "America/Lima",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Madrid",
  "UTC",
];

export function getSupportedTimezones() {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }

  return fallbackTimezones;
}

export function isSupportedTimezone(timezone: string) {
  return getSupportedTimezones().includes(timezone);
}
