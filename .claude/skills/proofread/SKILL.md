---
name: proofread
description: Proofreading report for one post in src/content/blog, in chat. Never edits the post.
argument-hint: "[slug, title words, or path]"
disable-model-invocation: true
allowed-tools: Bash(git status:*), Read, Glob, Grep
disallowed-tools: Edit, Write, NotebookEdit, MultiEdit
---

# Proofread

Aaron wrote the post and proofreads it himself. He writes in an IDE,
not a word processor, so this report is the short list a word
processor would have underlined, plus what one cannot see: a sentence
that reads as generated instead of like him, and a spot where a reader
gets lost. Precision is the whole value. A short list he can trust
beats a long one he has to sort, and the file stays exactly as it is.

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

Read `voice.md` in this folder first, then the post. The never-flag
list has to be in mind before the prose is, so a habit is recognized
as a habit on first sight instead of queued as a finding and argued
away later.

## Report

One flat list in chat: mechanical errors first, then voice, then
sense, with no headings or labels between them. Each item starts with
the line number and the exact text, because the quote is what he
searches for. A quick fix stays inline after `->`. When a rewrite
explains the problem better than a note can, put the rewrite in a
blockquote under the item; he reads it for the point it makes, so a
whole sentence is fine there.

```markdown
* 12: "recieve" -> receive
* 30: "/2024/some-slug/" -> that post is dated 2025
* 31: "It's not about speed, it's about trust" -> contrast frame, not his
  > Speed matters less than trust here.
* 40: Who is "they", the client or the team?
  > The client had already signed off, so the team moved on.
```

Nothing to report is one line: `No issues.`

**Mechanical** is every item a spellchecker or a careful copyeditor
would mark: spelling, homophones (its/it's, whose/who's, their/there,
your/you're), doubled words, a missing apostrophe, a sentence that
lost a word. Then the checks a spellchecker cannot make: an odd count
of lines starting with three backticks, a `:::callout` without its
closing `:::`, frontmatter (`date` quoted and starting `YYYY-MM-DD`,
every tag has a file in `src/content/tags/`, no key outside title,
date, tags, context, draft, evergreen), every internal link
`/YYYY/slug/` resolved to `src/content/blog/slug.md` with a date
starting `YYYY`, a command or file name in prose that the post
elsewhere puts in code font, and an identifier named in prose that
the code block does not define.

**Voice** flags a sentence only when it reads as generated rather
than like him: a tell from the list in `voice.md`, a shift in
register, a construction he never uses. He writes well, and a
well-made sentence is not a tell. The models learned from writers
like him, so the same polish shows up on both sides; what gives
generated text away is the pattern out of his register, not the
quality. Say
what specifically reads as off. At most one reminder per report, in
the form "you usually ...", when the post departs from a habit the
quotes show every time; omit it when nothing stands out, since a
forced reminder is noise.

**Sense** holds at most three items, only where a reader would get
lost: a contradiction, a reference to something never introduced, a
setup with no payoff, a pronoun whose referent changed within a
sentence. Phrase each as a question, with the rewrite in the
blockquote as the example. Three is the cap because a fourth is never
the most important one; rank and cut, never append.

## Calibration

* Nothing on the never-flag list in `voice.md` is an issue.
* Prefer a no-op to an uncertain flag.
* Punctuation placement and colloquial grammar are his. Flag
  punctuation only for a missing apostrophe or an unclosed pair, and
  grammar only when the sentence is wrong, not when it is loose.
* No scores, no praise, no summary of what the post is about.
* Never suggest a change of tone or formality. Casual is the register.
* In your own text, including rewrites, no em dashes and no spaced
  hyphens. His spaced hyphens in the post are never a finding.
