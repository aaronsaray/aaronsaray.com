---
title: "Your .env.example deserves better comments"
date: "2026-10-26"
tags:
  - laravel
  - programming
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-10-26-your-env-example-deserves-better-comments"
  canonical: true
---

The Laravel skeleton's `.env.example` has a few comments in it, and they all do the same job: commenting out a value you might want to switch to or use later.
For example, `# DB_HOST=127.0.0.1`, `# CACHE_PREFIX=`, and others.

<!--more-->

Environment files feel a little bit different.
They're not code, they're configuration.
But, they also support comments.
The trouble is, most of the time I only see comments like these from the Laravel example file.

We can (and should) do more with this comment functionality.

Comments can help explain why we might use one setting versus another.
For example, you will see this in one of my `.env.example` files:

```ini
# Set MAIL_MAILER=log when manually testing magic-link flows in the browser so
# the emails dump into storage/logs/laravel.log instead of being sent.
MAIL_MAILER=smtp
```

This is a reminder to myself (and others on the team) why we might swap this line.
Normally, I might deliver my email via SMTP to something like Mailpit.
But, if I'm doing a repetitive job and this is too much task switching and leaving my IDE, I will just use my local log file instead.

Now, here's the real kicker: sometimes I do this for my AI-assisted Playwright MCP sessions as well.
I swap this configuration before I start the automation so that the agent can retrieve the email details automatically.
It doesn't have access to my local mail client.

One word of caution: don't start writing books of comments in your `.env.example` file.
You can write comments, which I support, but they're still meant to be very sparse.
If you need to document something larger, consider different documentation tools, like a README entry or documenting the functionality near the usage of the environment variable.
`.env.example` comments are helpful for those one-offs, reminders, and very small bits of context.
