---
title: "Why I sometimes sign my code comments"
date: "2026-07-02"
tags:
  - programming
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-07-02-why-i-sometimes-sign-my-code-comments"
  canonical: true
---

Code and comments belong to the whole team.
Once something lands in the codebase, the next reader tends to treat it as established fact, even when it started as one person's hedge or guess.

Sometimes that is exactly the problem.
Now and then I write a comment that is not settled truth.
Maybe I am unsure, maybe it is a personal opinion, maybe it is only true for today.

<!--more-->

In those cases I tag the comment with my initials, like this:

```php
// I think we can safely cache this for an hour because the upstream feed
// only updates daily, but I haven't confirmed that with their team. ^ADS
return Cache::remember('feed', 3600, fn () => $this->fetch());
```

The `^ADS` is not about forever identification (`git blame` already covers that).
It's a deliberate signal: this comment belongs to one person at one moment, not to the team.
Treat it as tentative.

So if it's temporary, what's the next programmer's job when they're reading it?
Verify it.

If the comment turns out to be right, remove the signature.
The comment becomes canonical and now belongs to the team. 

If it turns out to be wrong, fix the code (or the comment) and remove the signature for the same reason.

This is, of course, a paradigm you can talk with your team about, but it's one I really love to implement to give extra context to others and myself in the future.
