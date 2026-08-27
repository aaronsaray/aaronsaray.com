# Design Prototypes

HTML prototypes for the aaronsaray.com redesign. No build step — plain
HTML files using CDN resources (Tailwind CSS browser build, Google
Fonts). Design decisions live in [`../DESIGN.md`](../DESIGN.md); read
that first.

We design for **mobile and desktop simultaneously** — every prototype
must look right at both ends before it's considered done. The workflow
for that is one tool pair: **Vite** serves the files with live reload,
and **Responsively** displays that served page in several device
viewports at once.

## Installing

### Node

Node **20.19+** (Vite 7's minimum), managed via **Volta**. Check with:

```bash
node --version
```

### Responsively App

Download the `.dmg` from <https://responsively.app> and install it.

## Using Them Together

1. Start the file server from the repo root:

   ```bash
   npx vite .design
   ```

   Vite prints a local URL (typically `http://localhost:5173/`).

2. Open Responsively and enter the prototype URL in its address bar,
   e.g. `http://localhost:5173/home.html`.

3. Pick devices from Responsively's left toolbar — a phone (e.g.
   iPhone 15 Pro), a tablet, and a desktop width give good coverage.

4. Scroll/click in any pane; the rest mirror it.

Vite live-reloads on file save, and that works inside Responsively
too — save the file and every pane refreshes. For a quick single-width
check, a plain browser tab pointed at the same URL also works.

## The Files

| File | What it is |
| ---- | ---------- |
| `home.html` | Homepage prototype — first design target. Slim header, full-viewport hero, beliefs/manifesto grid, working footer. |
| `blog-single.html` | Blog post page prototype — second design target. Serif title, meta line, dark reading treatment for prose/code. |
| `blog.html` | Blog index prototype — 10 real post titles with generated subtitles, meta lines, Newer/Older pagination (rendered as page 2). |

`home.html` and `blog-single.html` are the **source designs**: every
other page (CV, contact, tag pages) will be derived from the patterns
established there — `blog.html` is the first derived page. Future
design tasks may optionally get their own files in this folder — same
rules apply (no build step, CDN only).

`inspiration/` holds the reviewed screenshots; `INSPIRATION.md` is the
archived review (decisions promoted to `DESIGN.md`).
