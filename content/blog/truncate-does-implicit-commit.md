---
title: Truncate MySQL Causes Implicit Commit
date: 2019-02-18
tag:
- mysql
- laravel
---
I guess I should [RTFM](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html) more often... but I didn't remember (or know??) that MySQL `truncate table` causes an implicit commit.

<!--more-->

I was doing unit testing in Laravel using the database transactions trait.  Part of my seed data has a dataset. I wanted to get rid of all of that data so I could start fresh in one singular test.  So, I started out writing the test like this: `MyModel::truncate()`.  I couldn't figure out why all of my test data kept getting all messed up then.  Turns out, the database transaction can't protect against implicit commits! Doh!

So, instead, I did this: `MyModel::getQuery()->delete()`.  Then, it was fine with the transactions.

Side note: This article is not me condoning seeding data and then truncating it for unit tests. It just happened to be my circumstance at the time.