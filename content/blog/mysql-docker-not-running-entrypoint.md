---
title: "Fix for Mysql Docker Not Running Entrypoint"
date: 2024-04-03T10:44:39-05:00
tag:
- docker
- mysql
---
When using the [Docker MySQL Container](https://hub.docker.com/_/mysql), you can specify files in the `/docker-entrypoint-initdb.d` folder to be imported or ran when the container is brought up. These can be in the form of `.sql`, `.sql.gz` or `.sh` - and get ran after the database is up but before its accepting connections.

But what if you can't seem to get these to run again? The fix is just so annoyingly simple.

<!--more-->

So, when my container came up the first time, I was able to run my `01.sql` file and import/modify content. I've stopped the container and start it back up - and those files don't run, as they should(n't).  This works properly.

However, when I do a `down` it is destroying the containers, so I figured it would run the data import again when I brought everything back up.  

But it didn't.  Why?

Well, I have a volume defined in my `docker-compose.yml` file for my MySQL data.  So, even after truncating and dropping tables/databases, there was still data in the volume to support the database. Because of this, the entry point files do not run - as they're not supposed to.

So what's the fix? Simple! Blow away your mounted volume as well that is supporting your MySQL container! It took me way too long to figure that out. (You probably want to use something like [docker compose rm](https://docs.docker.com/reference/cli/docker/compose/rm/) to do this.)