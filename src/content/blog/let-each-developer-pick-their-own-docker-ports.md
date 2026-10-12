---
title: "Let each developer pick their own Docker ports"
date: "2026-10-19"
tags:
  - docker
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-10-19-let-each-developer-pick-their-own-docker-ports"
  canonical: true
---

I love using Docker's Compose functionality for our local development.
But, even though Docker nicely isolates most of the app code and functionality from my host, there are still some things that bridge this gap.

<!--more-->

One of them is Docker-to-host port mapping.
In a `compose.yml` file, we can define which ports on our host machine forward to which ports on the container.
This allows every developer to have the same ports mapped, and everyone is happy.

Except it doesn't work like that all the time.
Maybe another developer has something else on port 3306 (a local MySQL), and now I'm telling him that he has to stop his service every time he wants to do local development.
Or, maybe I've joined a client's project and their very specific port mappings conflict with other completely unrelated things on my machine.

One way to handle this might be to reach for the `compose.override.yml` file and add it to `.gitignore`.
This [merges automatically](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/) and you're good to go.

That works, but now we have to add steps to our README detailing this file's job.
Also, that file can drift from the main `compose.yml`.
You have to remember to check your non-versioned files to make sure they align.

I think there's a better fix.
And it's already used locally by you to configure your own environment: your `.env` file.

Here we can define additional environment variables and then use them directly in our `compose.yml` file.

```yaml
services:
  database:
    image: mysql:8.4.6
    ports:
      - "${DB_FORWARD_PORT:-3306}:3306"
```

If `DB_FORWARD_PORT` isn't set, Docker uses `3306`.
And what about the other dev?
He just drops `DB_FORWARD_PORT=33060` into his `.env` and he's done.

Now you have a `compose.yml` that always works, is always up to date, and is a customization knob any developer can control.
