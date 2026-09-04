// Formatting parses the components directly: new Date('2008-05-20')
// is UTC midnight, which a local-timezone formatter would render as
// the previous day.

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "May 20, 2008" */
export function formatDate(date: string): string {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d || !MONTHS[m - 1]) {
    // Unreachable for schema-validated dates; a caller that bypasses
    // the schema would otherwise render "undefined NaN, NaN".
    throw new Error(`formatDate: malformed date string "${date}"`);
  }
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * The one place a Date object is allowed: the 545-day threshold is
 * nowhere near a timezone boundary and the result never touches a
 * URL. The build is date-dependent as a result: the same commit can
 * render the notice differently on different days.
 */
export function isOldPost(date: string): boolean {
  const ageDays = (Date.now() - new Date(date).getTime()) / 86_400_000;
  return ageDays > 545;
}
