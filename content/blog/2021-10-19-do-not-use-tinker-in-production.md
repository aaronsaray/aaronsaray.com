---
title: Do Not Use Laravel Tinker in Production
date: 2021-10-19
tag:
- php
- laravel
---
I'll say it again: do not install Laravel Tinker in production, and certainly do not use it.  It's a great tool to do work in your application, but only in test and development environments. That's why I only install it in my `require-dev` section of my `composer.json` file.

<!--more-->

### Why Not?

There are a few reasons, but let's focus on just a few.  

First, this can lead to data integrity issues and may not produce a good enough audit of changes.  When you run commands in Tinker, those are ephemeral PHP statements and are not part of your source code history.  You might find yourself or the team asking questions like "how did that data change?" or "who did that?"

Second, there are always security implications of adding full REPL-style code into a server.  True, if someone has access to a server, they likely have access to running a PHP REPL or writing other code.  But, I think this just opens up another avenue of code access that I may not want.

Third, you might find that you're issuing background events or notifications without realizing it.  Now, you might argue that you would already be testing these Tinker commands locally, so you'd know - but I think most people don't _actually_ do that.  You have a quick thing you need to update, you'll likely just go there to Tinker and update it without thinking about what might also be hooked in.

So, I think the **tl;dr** of this is that the programming isn't versioned, and it's likely less tested.

### But What About...?

One of my pet peeves of 'best practice' advice is that they don't always address the real world issues we programmers run into.  So let's tackle the two most common issues I've ran into - and why a different solution works better.

#### Tinker to Update Some Data

Perhaps you have to convert some data.  It might seem simple to push out your updated code and then immediately jump into Tinker and just run a quick update of data.  You can easily grab all the models you need, update them, and save them.

But, don't do this.

Instead, write a one-time conversion script using the Laravel console command syntax.  I tend to prefix the name of these with `one-time:` - so you might have `one-time:convert-state-data` or something.  Then, you can have a versioned command that you can run to update the data.

There are a couple benefits:

First, if you have a code review process - and you should - now someone can review your logic that you are using to update the data.

Second, you have a history of the command.  Don't worry - with something like git you can delete this right after it's ran.  Then, if you need to look for it, it'll be in your history.

Third, it's easier to think about the conversion script as a holistic process this way. You'll be much more likely to unguard models or disable events when needed.  

Oh, and a bonus, I'll share one tip I always use: MySQL transactions.  This way, when I'm running the conversion, if even one thing goes wrong, it'll roll back. You can do this easily like this:

```php
DB::beginTransaction();
// do things
DB::commit();
```

Much harder to remember doing this when you are in Tinker.

#### I need weird one-off reports for the boss

I've had this come up a lot, too. The boss wants to know the answer to a question - NOW.  "How many users do we have in Oklahoma?".  Let's say you have a `User` model with a `HasMany` relationship to the `Address` model.  You might find yourself doing something like this in Tinker:

```php
User::whereHas(
  'addresses', 
  function ($q) { $q->where('state', 'Oklahoma'); }
)->count();
```

Great - but it's also very easy to have a bad day and replace `->count()` with `->delete()`.  Yikes!

Instead, I recommend using a tool like [Metabase](https://metabase.com) which can help you make data reports like this very easy.  Or, you may even expose it to your boss with some setup.  Let's see what that same sort of question answered in Metabase looks like.

First, open up Metabase with the connection to your database.  Click **Ask a Question** and choose the **Simple Question**.

[![Screenshot](/uploads/2021/metabase-report-1.jpg)](/uploads/2021/metabase-report-1.jpg){: .thumbnail}{: .inline}

Choose the database of choice, and click the **Addresses** table.

[![Screenshot](/uploads/2021/metabase-report-2.jpg)](/uploads/2021/metabase-report-2.jpg){: .thumbnail}{: .inline}

Then, choose the **filter** option, and click **State** - select **is Oklahoma**.

[![Screenshot](/uploads/2021/metabase-report-3.jpg)](/uploads/2021/metabase-report-3.jpg){: .thumbnail}{: .inline}

Click **Add Filter**.

[![Screenshot](/uploads/2021/metabase-report-4.jpg)](/uploads/2021/metabase-report-4.jpg){: .thumbnail}{: .inline}

Now you'll see the addresses for Oklahoma.  

[![Screenshot](/uploads/2021/metabase-report-5.jpg)](/uploads/2021/metabase-report-5.jpg){: .thumbnail}{: .inline}

But, we want to **Summarize** this data - so click that button.  Click the Count option and choose Number of distinct values, and choose **User ID**.

[![Screenshot](/uploads/2021/metabase-report-6.jpg)](/uploads/2021/metabase-report-6.jpg){: .thumbnail}{: .inline}

Now you have your answer!

### End Notes

I think Laravel Tinker is incredibly useful during development and testing.  But, you should not install it in production. Instead, use one-time scripts or commands, and use proper reporting tools.
