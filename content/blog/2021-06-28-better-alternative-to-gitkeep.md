---
layout: post
title: A Better Alternative to .gitkeep
tags:
- git
---
Since git does not store folders specifically (just path information), if you need an empty folder in your project that can be hard. Especially if that folder needs git to ignore any content inside of it. A community convention to solve this challenge has been the `.gitkeep` file. This is not part of the spec, combining that file with various `.gitignore` rules can solve this problem. But, there's a better way.

Instead of having a `.gitkeep` file littering up your repository, you can use a `.gitignore` file in a different way.  

Here are the two scenarios.

**Scenario 1: I want a folder to be versioned and it may contain versioned content later.**. To do this, create an **empty** `.gitignore` file inside of your target folder.  Git processes rules for a path based on the `.gitignore` file with the most locality, so this would basically be an instruction to do a "no op" in a way.  It will force the filesystem to create a folder at this path, and will allow for easy non-forced versioning in the future.

**Scenario 2: (A far more likely one) I want a folder to be created but all of its content to be ignored by git.** To do this, create your folder and put a `.gitignore` file with the following content:

```
*
!.gitignore
```

This will tell git to ignore all content, except the `.gitignore` file that contains these instructions.  I like this method because it not only doesn't add a non-standard file to your repository, it's a way of self-documenting your intention closer to the source.  (Sometimes people may forget all of the instructions that are at the root `.gitignore` file.)
