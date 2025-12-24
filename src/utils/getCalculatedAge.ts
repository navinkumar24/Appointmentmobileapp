// utils/getCalculatedAge.ts
type InputDate = string | Date | null | undefined;

/**
 * Parse a Date or a "DD-MM-YYYY" string into a Date object.
 * Returns null for invalid input.
 */
function parseDDMMYYYY(input: InputDate): Date | null {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input.getTime())) return input;
  if (typeof input !== "string") return null;

  const parts = input.split("-");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day < 1 ||
    month < 0 ||
    month > 11
  ) {
    return null;
  }

  const d = new Date(year, month, day);
  // validate constructed date corresponds to input (catches invalid days like 31 Feb)
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d;
}

/**
 * Returns age as a single unit string:
 * - "N Yrs"  if >= 1 year
 * - "N M"    if <1 year and >=1 month
 * - "N D"    if <1 month
 *
 * If input is invalid or fromDate > toDate, returns "0 D".
 */
export default function getCalculatedAge(
  fromDateStr: InputDate,
  toDateStr: InputDate
): string {
  const from = parseDDMMYYYY(fromDateStr);
  const to = parseDDMMYYYY(toDateStr);

  if (!from || !to) return "0 D";

  // If from is after to, return 0 days (you can change this behaviour if you prefer an error)
  if (from.getTime() > to.getTime()) return "0 D";

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  // Adjust days
  if (days < 0) {
    // days in previous month of 'to' date
    const prevMonthDays = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonthDays;
    months -= 1;
  }

  // Adjust months
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  // Single-unit output as requested
  if (years >= 1) {
    return `${years} Yrs`;
  }
  if (months >= 1) {
    return `${months} M`;
  }
  return `${days} D`;
}
