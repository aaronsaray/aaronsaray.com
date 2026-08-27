// Dates stay strings end to end (the URL year is date.slice(0, 4)).
// Formatting parses the components directly — new Date('2008-05-20')
// is UTC midnight, which a local-timezone formatter would render as
// the previous day.

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Hugo's "Jan 2, 2006" display format. */
export function formatDate(date: string): string {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Hugo parity: the old-post notice shows past 545 days, at build time. */
export function isOldPost(date: string): boolean {
  const ageDays = (Date.now() - new Date(date).getTime()) / 86_400_000;
  return ageDays > 545;
}
