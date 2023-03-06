---
title: Keep Data Migrations Separate from Database Migration
date: 2019-01-07
tags:
- php
- laravel
- mysql
---
By now, you've probably written many database migrations in Laravel. But, then something else happens.  Perhaps your business model changed, your data attributes changed or you're just refactoring to a stronger architecture. Doesn't matter which, you're going to need to convert and migrate some data.

<!--more-->

Your first step might be to look at Laravel's [database seeding](https://laravel.com/docs/5.6/seeding) to seed in your new data or changed data.  But that's not what this is for. It's for new, supportive data, not for data migrations.  

On your search, you'll see advice [like this](https://medium.com/chriskankiewicz/seeding-is-hard-e979705db139) that suggest that you migrate your data in your database migrations.  In fact, some decent articles that have a lot of good things in them [even suggest this](https://medium.com/@lars.peterke/logging-model-changes-and-11-other-ways-to-improve-your-laravel-projects-a7af2e5fcd24).  But, I don't think this is right.

**Migrate your data separate from your database migrations.**

Let's talk about the reasons.

First, your database migrations should, in a perfect world, not cause your app to crash if they're _not_ run.  Let me rephrase that. Your code should be able to handle a database in pre/post migration schema.  That's a perfect world, so luckily database migrations usually go pretty fast.  So, let's take advantage of that. It's not great, but we can put our site in maintenance mode for a split second, migrate our database, and pop back into normal working mode.

Next, your application should function on your next release with the old and new data format.  Data migrations tend to take longer to run.  I don't know about you, but I can't afford significant down time in my projects.  Therefore, after I've deployed my code, I want my site to run and to convert my data in the background. (In very rare instances you can come to a race condition like this. If that's the case, then take it down for maintenance and execute the conversion again. The amount of race-based old data should be minimal making this downtime brief.)

Finally, a code deploy should be quick. When you're writing data migrations as part of your database migrations, you're most likely running them during deploy.  We want the least amount of down time, or the least amount of build time as possible (build time, assuming that you're swapping out environments instead of live-updating). If you force a data migration with the deploy, you can time out automated build tools and cause other types of issues.

### Final Notes

I guess you can say this is one of those opinion pieces.  I don't know if my way is best practice, but based on experience, I think it's right.  But we don't live and program in a perfect world, so sometimes its necessary to gather together all of the changes into one package and execute it immediately. I just think we should break those packages into smaller chunks, like separating our database migrations from our data migrations and conversions.