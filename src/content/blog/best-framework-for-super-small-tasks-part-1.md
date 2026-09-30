---
title: "What is the best framework for a super small task?"
date: "2024-10-22"
tags:
  - laravel
  - php
  - programming
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-10-22-best-framework-for-super-small-tasks-part-1"
  canonical: true
---

"If you only have a hammer, everything is viewed as a nail" is an idiom referred to as Maslow's hammer. It basically means that if you only know one tool, and you over-rely on it,
you'll only use that tool to solve every problem, regardless of whether it's the right one for the job. (It's a common saying around these parts... that and Joel's famous saying 
"Do you even have a 5th bathroom if the floor isn't heated?")

Laravel is quite the Swiss Army Knife - it has easy solutions for just about every problem and task you have. That's why I'm such a fan of it. But is it always the right tool for the job?

<!--more-->

Let's explore this with a simple and somewhat common style of problem: we need a service to ingest a JSON response from a 3rd-party end-point and append that data to a file every minute. Gross. But, hey, this type of glue holds the internet together.

In part 1, let's solve this with Laravel.

First, create a new command with `php artisan make:command WriteIngestedData` 

Let's also add the following to `routes/console.php`

```php
use \App\Console\Commands\WriteIngestedData;

Schedule::call(WriteIngestedData::class)->everyMinute();
```

You can assume I've successfully configured cron to run the Laravel scheduler every minute. Now, let's take a look at the command itself.

```php
public function handle()
{
  $data = Http::get('https://source.com/api/json');
  Storage::append('stream.json', $data);
}
```

Ok I have to say, this is pretty great. In this (contrived) example, it really doesn't take much code to solve our problem.

Except, it does.

We need to install a whole vendor folder with Laravel, not to mention all of its dependencies. 
And while that's fine normally, it can be a problem if you're limited on resources and space. And it can feel over-complicated if this is the only task you need to accomplish.

But at least it's far more performant than other frameworks and code.

Except it isn't.

Laravel does a tremendous amount of things to make our developer experience easier and more effective and efficient. But that introduces a little bit of overhead. 
We need to configure cache, configuration options, filesystem directives and more. This system is invaluable in medium and large projects - but it is definitely not giving us the benefit on a one-off small task.

So, now that it's 2024, what is the best framework for a quick, small task? [Part 2 reveals](/2024/best-framework-for-super-small-tasks-part-2/).
