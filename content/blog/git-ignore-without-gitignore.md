---
title: "Git Ignore Without the .gitignore File"
date: 2024-04-03T11:01:06-05:00
draft: true # don't forget to change the date
tag:
- git
---
As a contractor, I go into a lot of projects. Sometimes these are set up perfectly and other times they need a bit of work for me to be effective and efficient. Some clients are willing to accept updates for tooling, others don't have the time, budget or ability to accept these updates. So, how can I use my tools - which require configuration files - without editing their project? Actually, git has a nice built-in functionality that will work perfect for this - and it's not the `.gitignore` file.

<!--more-->

Normally, when you use a `.gitignore` file (not to be confused with [`.gitkeep` which is awful]({{< ref "better-alternative-to-gitkeep" >}})) you can tell git to ignore specific files or patterns. 

But in this case, the client doesn't want entries in that file for things they're not using and/or I don't want to pollute their project with information about my tools.

That's where the local `.git` checkout comes in to play - specifically the `.git/info/exclude` file.

The `.git/info/exclude` file is basically just a `.gitignore` file but locally in your checkout. It is not available to the project or for other users. You really don't want to use this unless you have a specific need that is only unique to your checkout.

So, for example, I might have clients using Valet to run their app. I don't want to install Valet, so I instead use Docker. I created a `docker-compose.yml` file and added it to my `.git/info/exclude` file. Now, I will not commit that file, the local `.gitignore` file is not modified, and I can use my desired tooling.
