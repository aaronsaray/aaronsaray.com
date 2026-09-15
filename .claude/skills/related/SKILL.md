---
name: related
description: Which existing posts to link for a thought, as paste-ready markdown links, in chat. With no arguments, checks the index against the posts. Never edits anything.
argument-hint: "[what you want to link to]"
disable-model-invocation: true
context: fork
agent: general-purpose
background: false
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git ls-files:*), Read, Glob, Grep
disallowed-tools: Edit, Write, NotebookEdit, MultiEdit
---

# Related

Aaron is drafting a post and remembers writing about the same idea
before. He could find it himself with an hour and a good memory; this
report is that hour. It runs apart from his conversation and cannot
ask a question, so every path through it ends in a report: an
ambiguous thought means the best few with their passages so he can
pick. A change the index needs is proposed at the end of the report
for him to approve.

## The index

`index.md` in this folder is a markdown table with one row per
published post: the URL, the title, and a summary written to be
grepped for the idea rather than for the words of the title. Rows are
in ascending order by URL, which puts them oldest first.

A row is `| URL | Title | Summary |`, leading and trailing pipes, a
single space each side of every pipe, nothing else. The URL is
`/YYYY/slug/`, where `YYYY` is the first four characters of the post's
`date` and the slug is its filename without `.md`. The title is the
frontmatter `title` verbatim, surrounding quotes removed, a title that
wraps onto a second YAML line joined with one space; his spaced
hyphens and his typos stay as they are, because the row has to match
the post. The summary is 25 to 45 words of plain text on one line,
with no `|`, no em dash, and no ` - `. It says what the post argues or
shows, in the terms a stranger would search for: the technology, the
technique, the named problem, the idiom when one fits (reinventing the
wheel, not invented here, yak shaving), a famous name or work. When
the post uses one name for a thing and the field uses another, give
both (`N+1`, eager loading). It never names acquaintances, coworkers,
employers, clients, the job at the time, or a date, and never says
"this post" or "the author". A post with `draft: true` has no row.

Drafting a row means reading the post in full first, then matching the
rows already in the file.

## Requested: $ARGUMENTS

If that line is empty or still reads `$ARGUMENTS`, nothing was
requested, and the pass is the freshness check at the end of this
file. Anything else is a thought.

## A thought

Before the first grep, restate the thought as three to six stems a
writer would use in a summary about it: the verbs (rebuild, reinvent,
roll, write), the objects (wheel, framework, package, from scratch),
and the idiom if one exists. Grep `index.md` for each stem alone,
case-insensitive, as a stem and not a word (`reinvent`, not
`reinventing`). Drop any stem that matches more than 20 rows or none.
Read the union of what is left. Between 1 and 40 rows, read only
those. Over 40, read `index.md` whole. No stem survived at all means
the thought has no purchase on the index and reading it whole will not
create one: go straight to the body grep below.

Read candidate posts in full, best first, and keep only the ones a
reader would recognize as the thing he meant. Stop at three kept or
six read, whichever comes first; three is the whole report, so a
fourth confirmation is wasted reading. Nothing confirmed: grep the
post bodies in `${CLAUDE_PROJECT_DIR}/src/content/blog` for the same
stems, skip any file whose frontmatter has `draft: true`, and read at
most six of what that finds, preferring files a stem hits more than
once. If a stem matches more than 40 files it is too common to be
worth reading; drop it, and if that leaves nothing, report `Nothing
close.` rather than reading into the corpus. Link text is always the
post's current `title:` from the confirming read, never the index row:
a title can change under a stale row.

## Report for a thought

Return it verbatim; the conversation that invoked this pastes it. One
to three links, best first, each `[Title](/YYYY/slug/)` on its own
line with the passage that matches quoted in a blockquote under it.
Three is the cap because a fourth is a list he could have grepped.

```markdown
[The Evolution of PHP Programmers](/2017/evolution-of-php-programmer/)
> write your own framework

[How to Learn Programming](/2018/how-to-learn-programming/)
> the way I learned programming doesn't make sense these days
```

Nothing confirmed is one line, `Nothing close.`, then the stems tried,
so he can rephrase.

When a candidate's row said something the post does not, or the body
grep found a post the index missed, end the report with `Index:` and
the row to write, in a fenced block, as `replace N` or `insert after
N` with `N` the line number in `index.md` and inserts keeping the file
in ascending URL order. He approves it; the conversation that invoked
this applies it.

## Freshness

Three git commands, each run bare (no `cd`, no `&&`, so it matches its
allow rule), with the paths as written. `${CLAUDE_SKILL_DIR}` and
`${CLAUDE_PROJECT_DIR}` are the shell's to expand, but `<hash>` is
yours: it is the hash the first command printed, substituted into the
second before you run it.

```text
git log -1 --format=%H -- ${CLAUDE_SKILL_DIR}/index.md
git diff --name-status <hash>^ -- ${CLAUDE_PROJECT_DIR}/src/content/blog
git ls-files --others --exclude-standard ${CLAUDE_PROJECT_DIR}/src/content/blog
```

The diff starts at the parent of the index's last commit, so a post
changed in that same commit is still checked. For every post the two
lists name: grep `index.md` for its URL, read the post, and propose a
row only when none exists or the existing one no longer fits the post
as it reads now. A post whose row already fits is not reported. A post
with `draft: true` gets no row and loses the one it has. A rename (`R`)
is a remove and an insert; a delete (`D`) is a remove.

Report as one fenced block, one entry per change: `insert after N`,
`replace N`, or `remove N`, then the row, with `N` the line number in
`index.md` and inserts keeping the file in ascending URL order. Every
`N` counts lines in `index.md` as it stands now, so entries go in
descending `N` and are applied bottom up; an edit then never moves a
line a later entry still points at. Nothing to change is one line:
`Index current.` If `git log` prints nothing, `index.md` has no
history yet and there is nothing to compare against; say so and stop.

## Calibration

* Links go only to posts in `src/content/blog`, never to a draft.
* A thought that names a post by title is still confirmed by reading.
* Never pad to three. Prefer `Nothing close.` to a stretch.
* No scores, no praise, no summary of the draft he is writing.
* In your own text, no em dashes and no spaced hyphens.
