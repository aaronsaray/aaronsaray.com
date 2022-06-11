---
layout: post
title: Add Interfaces to Laravel to Increase Code Readability and Verbosity
tags:
- php
- laravel
---
There seems to be an endless debate: clearly written code doesn't need comments _vs_ comments are needed to explain code and give context.  I can see both sides of this debate, but there is a middle ground. Let me show you one way.

The biggest concern I have with code I read is about the intent of the author, not the intent of the code.  Code is easy to read, what the author meant can be harder. That makes it harder to code review. Sometimes code is perfectly written to do a thing, but fails because it solved something elegantly that was not the intent.

Let's see an example in Laravel 9.  Let's make a new listener.

`php artistan make:listener DoAThing`

Let's take a look at the default version of this file:

```php
<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DoAThing
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        //
    }
}
```

Ok, now let's see what I'm talking about.  If you want this listener to queue, you can implement the `ShouldQueue` method. Now, we have a pretty good sense that this listener - the intent of the programmer - is to have this listener queued.

If the interface is not implemented, what does that mean?  Well, if you really mean that it should NOT be queued, you might even go as far as removing the `use` method so that there's no confusion.  Ok.  Great.  But what about most developers who just don't implement the contract?

The question is simple: Did the developer intend to have this listener queue?  I can tell you that the code doesn't really answer that question as is. You could say yeah they intended not to queue it because it's not implemented. I would argue they intended to queue it but forgot to implement it.  We don't know.

So, what's the solution for something like this?

I love that some of the functionality of Laravel is implemented with interfaces. If you look at `ShouldQueue` in the source, you'll see that it doesn't actually contain anything - it's just an empty interface. The fact that the listener will be an instance of that interface is good enough to trigger the functionality.  Seeing the implementation on the source class is enough for us to understand it should be queued.

We can do the same thing ourselves with our own interfaces to help make our code more clear and more verbose.  Let's say that I don't want this listener to queue.  So, maybe I make a new interface in my project:

**`app/Contracts/ShouldNotQueue.php`**
```php
<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Interface ShouldNotQueue indicates that this optionally queueable 
 * element should absolutely NOT queue.
 */
interface ShouldNotQueue
{
}
```

And then, our `DoAThing` listener now looks like this:

```php
class DoAThing implements ShouldNotQueue
```

Now, we have clear intent that this element should not queue, instead of maybe it looking like a forgotten line or missed intent.