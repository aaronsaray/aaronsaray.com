---
title: "Fixing PHPStorm when Git Stops Responding"
date: 2026-02-26
tag:
- git
- macos
- phpstorm
---
PHPStorm suddenly stopped recognizing my git repository. I cleared the cache, restarted the IDE, but nothing helped. I jumped to my terminal, ran git from the command line, and everything worked fine there. Confusing, right?

Let me explain why this happened and how I fixed it for good.

<!--more-->

After the cache clear and restart didn't help, I needed to commit and push some changes. So I did that from the command line - no issues at all. When I went back to PHPStorm, I noticed a small notification I had missed before - it was asking me to accept the Xcode command line tools license agreement. I accepted it, restarted PHPStorm, and git was back.

But why did the command line work when PHPStorm didn't?

**Two gits on macOS**

On macOS, there can be two versions of git. There's the one that comes with Apple's Xcode command line tools (at `/usr/bin/git`) and there's one I chose to install through Homebrew (at `/opt/homebrew/bin/git`) because it was more up to date at the time. My terminal uses the Homebrew version because of my shell's `PATH` configuration. PHPStorm, by default, uses `/usr/bin/git` - Apple's version.

When Apple's git can't run because the Xcode license hasn't been accepted, PHPStorm's git integration breaks entirely. But my terminal git keeps working because it's a completely different binary.

**Fixing this in PHPStorm**

Accepting the license got me working again, but to prevent this from happening in the future, I pointed PHPStorm at my Homebrew git instead.

- Run `which git`. You should see something like `/opt/homebrew/bin/git`.

- In PHPStorm, go to **Settings** → **Version Control** → **Git**.

- In the **Path to Git executable** field, replace the default `/usr/bin/git` with your Homebrew path.

- Click the **Test** button next to the path to verify it works. You should see a success message with the git version.

- Click **Apply** and **OK**.

Now PHPStorm uses the same git binary as your terminal. No more surprise breakages when Apple decides you need to re-accept a license agreement.
