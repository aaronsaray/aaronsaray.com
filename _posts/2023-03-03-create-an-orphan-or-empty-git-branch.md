---
layout: post
title: Creating an Orphan or Empty Git Branch
tags:
- git
---
Sometimes you may want to make a completely empty git branch in your repo. This is how you can do it.

```bash
git checkout --orphan new_branch_name
git rm -rf .
```

Why? You may end up wanting to create a v2 or the next version of your application, yet retain all of the history in the same repo.  If you're starting from scratch you can do this. For example, I'll be doing this when I convert the blog from Jekyll to Hugo.

First, this creates a new branch as an orphan.  Then the existing files from the old branch still need to be unstaged and removed.  That's where the rm rf comes from.