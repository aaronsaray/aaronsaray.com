// Shiki transformer: copy the fence meta `filename="…"` (written by the
// Hugo filename-header migration) onto the pre as data-filename, where
// rehype-code-chrome picks it up. Astro hands the raw meta string to
// transformers as options.meta.__raw.
export function shikiMetaFilename() {
  return {
    name: 'meta-filename',
    pre(node) {
      const raw = this.options.meta?.__raw;
      if (!raw) return;
      const m = /filename="([^"]*)"/.exec(raw);
      if (m) node.properties.dataFilename = m[1];
    },
  };
}
