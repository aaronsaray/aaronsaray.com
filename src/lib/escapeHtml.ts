// For text placed between tags in a hand-built HTML string. Text from a
// hast tree has its entities decoded, so a literal "&" or "<" in it
// becomes live markup downstream unless it is re-escaped.
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
