/** Local-date helpers for Mission Control's week/month/year rollups. */

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Monday of the current week, as YYYY-MM-DD. */
export function startOfWeekISO(now = new Date()): string {
  const d = new Date(now);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

export function startOfMonthISO(now = new Date()): string {
  return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
}

export function startOfYearISO(now = new Date()): string {
  return toISODate(new Date(now.getFullYear(), 0, 1));
}

export function todayISO(now = new Date()): string {
  return toISODate(now);
}

export function greetingForHour(hour: number): string {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}
