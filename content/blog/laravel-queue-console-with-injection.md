---
title: Use Dependency Injection in Laravel Console Commands
date: 2017-09-23
tag:
- php
- laravel
- testing
---
It's important to unit test your application code - even your console commands.  So many times, I've seen people using the `Artisan` facade inside of console commands to either queue up new commands or call a different command.  This makes it more difficult to unit test the application - you have to rely more on fakery (requiring you to reset your application each time then) and/or integration tests.

<!--more-->

For example, you might have a large collection of items in an array inside of our `RunSomethingCommand` class.

```php
public function handle()
{
  foreach ($this->retrieveALot() as $items) {
    Artisan::queue('do-something', ['item_id' => $item->id]);
  }
}
```

This is decent - you found you have a lot of items that you have to run - so instead of making the console command wait, you're using the queue.  Good for you!  However, I just don't like that `Artisan` call in there - in my experience, nested Artisan commands get somewhat tricky to test.  I also prefer to use dependency injection whenever possible (you may disagree, that's up to you. Not the point of this entry.)

Instead, you can import the console command contract into your console command using this line:

`use Illuminate\Contracts\Console\Kernel;`

Now, let's take a look at our class, a little bit more expanded.

```php
protected $artisan;

public function __construct(Kernel $artisan)
{
  $this->artisan = $artisan;
}

public function handle()
{
  foreach ($this->retrieveALot() as $items) {
    $this-artisan->queue('do-something', ['item_id' => $item->id]);
  }
}
```

By naming the protected property `$artisan` we make it easy to read for someone who isn't exactly certain what's going on - it's also a bit of a self-documenting step.  But, this way, we can now unit test this console command outside of the actual Laravel ecosystem.   We can mock out the injected Kernel contract item and then make sure that each time the queue command gets called, it will have the proper information.  We don't have to 'catch' each of those calls or reset our application after this test.

Extra note - since this is the kernel contract, you could also call items immediately, by using `$this->artisan->call()` instead of `queue()`.