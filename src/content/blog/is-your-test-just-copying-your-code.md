---
title: "Is your test just copying your code?"
date: "2026-10-12"
tags:
  - testing
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-10-12-is-your-test-just-copying-your-code"
  canonical: true
---

I found this when writing tests for a project, sitting right in the `routes/web.php` file:

<!--more-->

```php
Route::get('/', function () {
  return 'The ' . config('app.name') . ' app is running at ' . config('app.url');
});
```

It looks like it's just meant to be a simple landing page to demonstrate the site is up.

My first gut reaction was that I wanted to refactor this.
Why aren't we using a Blade view?
No style and design?
But before anything else, I always make sure I completely understand the code and prove it works like I think it does.
So, I want to write a test.

Woah!
Turns out there already was one:

```php
public function testHomePageRenders()
{
  $appName = config('app.name');
  $appUrl = config('app.url');

  $response = $this->get('/');
  $response->assertOk();
  $this->assertEquals('The ' . $appName . ' app is running at ' . $appUrl, $response->getContent());
}
```

We have a problem here.
It's never a good idea to have the same logic on both sides of your test.
Then, you're not testing your code.
You're testing your ability to copy and paste.

Let me show you the solution first, then I'll explain:

```php
public function testHomePageRenders()
{
  config([
    'app.name' => 'BubblesMcGee',
    'app.url' => 'https://some.site.here',
  ]);

  $response = $this->get('/');
  $response->assertOk();
  $response->assertContent('The BubblesMcGee app is running at https://some.site.here');
}
```

First, we shouldn't rely on whatever configuration happens to be loaded when we can set this ourselves in tests at runtime.
I'm choosing values for my configuration that are still recognizable, but very unlikely to be real.
This proves that the route code will be reading from `config()`.
Otherwise, technically the site name and URL could be hard-coded to match the standard app config values, making the test a bit of a liar.

Next, we swapped to asserting the exact content of the final string.
So, whether I load that page in my browser or read the code, I should know what that output is expected to be precisely.
So, if I'm setting the config values myself, I should know what the end result string is, exactly.
This now tests this exact output without the copy-pasted logic on both sides.
