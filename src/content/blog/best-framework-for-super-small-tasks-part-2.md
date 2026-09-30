---
title: "Part 2: What is the best framework for a super small task?"
date: "2024-10-23"
tags:
  - php
  - programming
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-10-22-best-framework-for-super-small-tasks-part-2"
  canonical: true
---

In [part 1](https://masteringlaravel.io/daily/2024-10-22-best-framework-for-super-small-tasks-part-1), I introduced the problem of periodically retrieving a JSON data end point and appending it to a file. This small, quick task can easily
be solved by the demonstrated Laravel code. It's simple, concise and readable. But is it the best solution?

<!--more-->

And, what does 'best' even mean? When reviewing the Laravel code, I pointed out that it wasn't the fastest and didn't use the least amount of resources, but it sure was easy to understand.  Does that make it the best?

For part 2, I submit a different 'best' solution. Instead of using Laravel, Symfony, or any other new, exciting framework, we'll use my favorite of all - plain PHP code. Boring!

First, let's create a PHP file and edit it: `touch task.php && open task.php`. This created a file and opened it in my editor.
As with part 1, please assume that I've scheduled `task.php` in cron to run once a minute.

Let's take a look at the PHP code:

```php
$contextRead = stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => 'Accept: application/json',
  ],
]);
$handleRead = fopen('https://source.com/api/json', mode: 'rb', context: $contextRead);
$handleWrite = fopen('/path/to/stream.json', mode: 'ab');
while ((($buffer = fgets($handleRead, 4096)) !== false)) {
    fwrite($handleWrite, $buffer);
}
```

So, maybe I was being a bit misleading: this isn't a framework at all!  Remember, we're just trying to create a one-off, small task. 
We're not creating a big or even medium-sized project - just this scheduled task.

So, in this light-weight example, we're dealing directly with the underlying streams (not even curl!).  
With one simple PHP script, no dependencies and nearly the fastest pure PHP code, this might be the best solution.

Except it isn't.

It is pretty hard to understand. You have to really understand the concept of streams and how they relate to the internet and the filesystem. 
Also, since it's pretty bespoke code, you may not find another online examples to compare your work to.

But at least it's way faster than any other framework or Laravel code.

Except... is it?

What benefit is speed if it's nearly impossible to track down errors and you have no visibility? 
Fast buggy code is just buggy code. Frameworks give us tooling that helps when things go wrong. 
Just look at the amazing work Laravel does with providing exception handling.

So, what is the best framework for our task?

It depends.

Man, I hate that answer.

But there is no real answer. As programmers, we need to have a well-rounded toolbox. This means not just Mastering Laravel, but understanding the underlying PHP and technical concepts of the internet, too. 

Not every thing is a nail. Make sure you're reaching for the right tool for the job.
