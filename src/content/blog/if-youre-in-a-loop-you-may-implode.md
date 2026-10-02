---
title: "If you're in a loop you may implode"
date: "2024-06-24"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-06-24-if-youre-in-a-loop-you-may-implode"
  canonical: true
---

In Blade files, we have a number of useful directives. Laravel decorates some of them with additional properties to make our life even easier.

<!--more-->

Some of the most useful are the looping directives, like `@for` and `@foreach`. These allow us to loop through an iterable (array, Collection, etc) in a safe, easy way without leaving the safeguards of Blade. These are also decorated with the `$loop` variable while inside of each. This is a special property provided by Laravel to provide details and hints about the current loop.

You've probably seen this in action - especially when looping through lists of data when you're working with Eloquent collections. Especially when it comes to styling, they may include a reference to the `$loop->last` boolean to indicate this is the last iteration, so do something slightly different. This is fine (although a lot of this can be replaced with targeted CSS selectors), but it's not the best solution every time. Let's see an example.

```blade
@foreach($books as $book)
  <h1>{{ $book->title }}</h1>
  <div>
    Author(s):
    @foreach($book->authors as $author)
      {{ $author->name }}
      @unless($loop->last)
        ,
      @endunless
    @endforeach
  </div>
@endforeach
```

The outermost `@foreach` is great. But, the one for authors doesn't seem great. I get it, it's trying to do a comma-separated list of authors, but it's hard to follow.  What's with that random comma just hanging out?

Sometimes we don't always have to use a loop. Let's combine a few methods of the Eloquent Collection to make this code a little simpler.

```blade
<div>
  Author(s): {{ $book->authors->pluck('name')->implode(', ') }}
</div>
```

Take just the name from the collection and implode it with a comma and space. I find that sometimes I forget that I'm dealing with a Collection in the Blade file - and that these methods are available for me. Pretty sweet.
