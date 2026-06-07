export type CruiseScheduleEntry = {
  date: string;
  ship: string;
  arrival: string;
  departure: string;
  cruiseLine: string;
};

export function formatScheduleDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
