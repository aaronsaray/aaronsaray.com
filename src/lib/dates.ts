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
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * 545 days is about 18 months. Age is measured at build time, so a post
 * gets the notice on the first build after its 545th day.
 */
export function isOldPost(date: string): boolean {
  const ageDays = (Date.now() - new Date(date).getTime()) / 86_400_000;
  return ageDays > 545;
}
