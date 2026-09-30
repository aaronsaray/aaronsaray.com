---
title: "sprintf is the single most valuable tool that you probably aren't using"
date: "2024-06-27"
tags:
  - php
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-06-27-sprintf-is-the-single-most-valuable-tool-that-you-probably-arent-using"
  canonical: true
---

A few years ago, I wrote a [gentle introduction to sprintf](/2022/do-you-even-sprintf/). For those who read it, their code quality, speed and readability increased dramatically (I hope...). 

But why would you even want to use `sprintf`? Its syntax looks pretty complex and we already have solutions for most of the things it solves. (This is how I felt about regular expressions early in my career. I have since learned the error of my ways.)

<!--more-->

I like to find tools that match my mental model when I'm converting business requirements to code.  So let's run with an example.

The PDF filename the client wants should contain the title field from the model, the author, and the date. Seems pretty simple. Let's see how we might make that.

```php
public function getFilename(): string
{
    $name = Str::slug($this->model->title) . '-' . Str::slug($this->model->author->full_name);
    $currentDate = \Carbon\Carbon::now()->toDateString();
    return $name . '-' . $currentDate . '.pdf';
}
```

Ok so this is ugly on purpose. But come on, we've all written something like this. But that is hard to understand. Let's talk through our requirements again, in even more detail, before we write new code.

"I need a file name that is the slug of the title followed by a dash, the slug of the author, followed by a dash, the current date in Y-m-d format, and it must end with dot pdf."

Here's how you might write that cleanly with the `sprintf` formatting.

```php
public function getFilename(): string
{
    return sprintf(
        '%s-%s-%s.pdf',
        Str::slug($this->model->title),
        Str::slug($this->model->author->full_name),
        \Carbon\Carbon::now()->toDateString(),
    );
}
```

Let's walk through it. We are generating a string that we want to return. It will have a string, `%s` in `sprintf` format, a dash, another string, another dash, another string and a dot pdf.  Then we tell `sprintf` in order what to substitute for its string variable definitions of `%s`. No more messy string concatenation.

But it doesn't stop there. That's just the tip of the iceberg.  Need special number formatting? `sprintf` has you. Padding of a string OR a number? `sprintf` does that. Convert your number to scientific notation? `sprintf` does that. It does all these complex things, but you don't have to go that far down the rabbit hole. Just learn a little and start applying it to clean up your code.
