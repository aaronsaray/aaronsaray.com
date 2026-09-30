---
title: "The security default we change in GitHub's checkout action"
date: "2026-06-18"
tags:
  - github
  - security
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-06-18-the-security-default-we-change-in-githubs-checkout-action"
  canonical: true
---

Most of our GitHub workflows pull in `actions/checkout` and never touch its inputs.
That is fine most of the time, but one input matters a lot for security.
It is `persist-credentials`.

<!--more-->

```yaml
- name: Code checkout
  uses: actions/checkout@v6
  with:
    persist-credentials: false
```

The default is `true`.
When it is `true`, the action leaves a `GITHUB_TOKEN` configured on the runner so any later `git` command works without re-authenticating.
That is handy when a workflow actually needs to talk to the remote, but those workflows tend to be rare and narrow in scope.

Most workflows don't push anything.
They check out the code, run the tests, run a linter, build some assets, and exit.
For those, the persisted token is doing nothing useful, and it is potentially a problem.
Any third party action or package in that job now has access to your token.
Depending on your permissions, that could be an elevated token that can open pull requests, write to your repo, or worse.

So here is the rule I follow.
Default to `persist-credentials: false`, and only flip it back to `true` when a workflow genuinely needs to talk to git.
