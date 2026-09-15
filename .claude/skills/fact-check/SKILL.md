---
name: fact-check
description: Fact-check report for one post in src/content/blog, in chat. Reads closed-book first and asks before looking anything up. Never edits the post.
argument-hint: "[slug, title words, or path]"
disable-model-invocation: true
allowed-tools: Bash(git status:*), Read, Glob, Grep, WebSearch, WebFetch, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_wait_for, mcp__playwright__browser_close
disallowed-tools: Edit, Write, NotebookEdit, MultiEdit
---

# Fact Check

Aaron wrote the post and knows the subject. The code in it was typed
from memory or copied out of a project and not run again, because
standing the project up is not worth it for a snippet, and the claims
around it were true when he learned them. This report is the second
set of eyes he would ask a peer for: someone who reads code the way he
does and spots a swapped argument or a method that does not do what
the sentence says, and who knows which of his claims are the kind that
go stale. It is not a linter, not a test run, and not a search. A short
list he can trust beats a long one he has to sort, and the file stays
exactly as it is.

## Find the post

Requested: $ARGUMENTS

If that line is empty or still reads `$ARGUMENTS`, nothing was
requested. An existing path is the post. Otherwise the request is a
slug or title words: glob `src/content/blog/*.md` for filenames
containing each word and grep `title:` lines for the same words; one
hit is the post, several means list them and ask. With nothing
requested, run `git status --porcelain -- src/content/blog`; exactly
one modified or untracked post is the post, and anything else means
list what you found and ask. Never pick on a guess, because a pass
over the wrong post wastes the run.

## Read

Read the post, then read it again as two things: the code, and the
claims.

Read the code as Aaron reads it. He can see that a block would not
parse, or does not do what the prose says, without running it, and so
can you. Nothing gets executed, linted, or piped through a tool; a
block that would not compile is found by reading it. Check each block
against the sentences around it: the line before promises one thing
and the block does another, the prose names a return value or a number
the block does not produce, a step uses a file or variable an earlier
step never created or later renamed, the prose explains a flag the
command does not pass. Then check the blocks against each other: an
argument order that is wrong for that function, an identifier that
changes name between blocks, a variable used before any block defines
it, a string or comment inside a block that contradicts the code
beside it. A version named in prose that disagrees with the `context:`
frontmatter is the same kind of error.

Read the claims against what you would say without looking anything
up, and draw the line at hedging. A claim is a finding only when you
would state the correction flatly, and only for a fact that does not
move: what a well-known function takes, what an exception is called,
what a term means. A version number, a support matrix, a package's
current API, a quote, a statistic, or a date is a candidate even when
you are sure, because those are the facts that change and a confident
wrong answer there costs more than a lookup. On this blog a `>`
blockquote is his own aside, never a quotation to attribute.

While reading, keep the list of what you would like to check outside
the post: browser or runtime support, "since version X", what a
package does today, who said something and in what words, a number or
a date, "the docs say", any claim about a third party the post cannot
vouch for from inside itself. Do not check any of it yet. The first
pass is closed-book so that it is fast and so that the report shows
which findings come from the post contradicting itself, which from
memory, and which from a source. Those are three different levels of
trust, and he needs to see which is which.

## Report

One flat list in chat, findings first, no headings. Each item starts
with the line number and the exact text, because the quote is what he
searches for. A quick fix stays inline after `->`.

Then, only when there is something on it, the candidate list, numbered
so he can pick by number: the line, the claim, and what it would be
checked against. If you have an expectation, put it in the line; it
shows him your recall without asserting it. End with one question:
which to check.

```markdown
* 31: "$users->pluck('id')->all()" -> prose says a collection; all() returns an array
* 52: "array_map($array, $fn)" -> callback comes first

1. 12: "supported in every browser since 2023" -> I believe Safari was later; caniuse
2. 40: "Knuth said premature optimization is the root of all evil" -> the full quote and its source

Check any of these?
```

Nothing to report is one line for each part: `No issues.` and
`Nothing worth checking.` Both are expected on many posts. A how-to
with a plain snippet and no claim about the world produces nothing,
and that is the right answer, not a failure of the pass.

## After a yes

Check only what he picked. WebSearch, WebFetch, and the Playwright MCP
are for this pass alone; when WebFetch comes back truncated, render
the page with Playwright instead of reporting off the fragment. One
line per candidate, same number, same line reference: the verdict,
the source as a URL or document name, and the corrected fact when the
post is wrong. "Confirmed" is a verdict and gets its one line. Cite
only a URL the tool returned; a remembered URL is the kind of fact
this pass exists to check.

## Calibration

* Opinions, predictions, advice, and judgment calls are never
  findings, including ones stated flatly in the middle of technical
  prose. He is allowed to be sure.
* A different way to do the same thing is a preference, not a finding.
  A finding says what is wrong.
* Prose, punctuation, voice, and links are the proofread skill's. The
  spaced hyphen is his and is never mentioned.
* Prefer a no-op to an uncertain flag, and never add an item to fill
  the list. An empty report is a result.
* No scores, no praise, no summary of what the post is about.
* In your own text, no em dashes and no spaced hyphens.
