---
layout: post
title: Techniques to Battle Expensive PHP Constructors
tags:
- php
---
Whether you've made the class yourself or you're using a pre-made SDK, there are times when the construction of an object might be expensive.  Expense, in this case, pertains to memory, time, CPU cycles, basically anything that is above baseline.  

### Why Care About Expensive Constructors

An argument shared a lot of the time is "so what if it's expensive to construct, you only create it when you're going to use it."  That's not always the case. There are a couple scenarios where that isn't true.

First, in certain testing scenarios, you might want to mock out a specific set of functionality, but retain the actual construction of the object - or the configuration of said object.  

Another reason has to do with dependency injection configuration.  Depending on the container and how loosely you've set it up, there might be scenarios where a class gets constructed but never used. This might happen if you're doing something like constructor injection of a service, but forget that a few methods don't actually use it.

So there are a number of reasons why we might need to not experience that pain - the above are just a few.  Let's solve this, though.

### Ideas to Battle Expensive Construction

To illustrate our expensive object, we're creating a service called `DanceParty` that has a constructor that is very expensive. (Think: it has to warm up the transistors in the amplifiers, yo!)

```php
<?php
class DanceParty
{
  public function __construct()
  {
    sleep(3); // that's how long it takes
  }
  
  public function doFunk()
  {
    $this->applyForPermit();
    // whatever you do here...
  }
  
  public function doMoshPit()
  {
    $this->applyForPermit();
    // metal!!
  }
  
  protected function applyForPermit()
  {
    // I know, I'm lame.
  }
}
```

And it's called like this:

```php?start_inline=1
$dp = new DanceParty();
$dp->doFunk();
```

In our case, we've got an expensive statement - the `sleep(3)`.  Every time this class is created, we have to sleep 3 seconds, a very expensive proposition.

What methods can we use to help handle this slow construction - and only have it when we need it?

#### Very Explicit

First, let's talk about the ["everything's a hammer/nail"](https://en.wikipedia.org/wiki/Law_of_the_instrument) method. Here, we're going to offload our logic to a method, and then just force every other method to call it first.

```php
<?php
class DanceParty
{
  protected $started = false;
  
  public function __construct()
  {}
  
  protected function start()
  {
    if (!$this->started) {
      sleep(3);
      $this->started = true;
    }
  }
  
  public function doFunk()
  {
    $this->start();
    $this->applyForPermit();
    // that 70's show called...
  }
  
  public function doMoshPit()
  {
    $this->start();
    $this->applyForPermit();
    // 7 string guitars ring out!
  }
  
  protected function applyForPermit()
  {
    // Follow the rules!
  }
}
```

Don't forget, we're doing this:

```php?start_inline=1
$dp = new DanceParty();
$dp->doFunk();
```

Now, when the object constructs, it doesn't have to do that expensive thing. Perhaps we'll never actually need the transistors to warm up because we find out we can't afford the dance party... Ok, but seriously, this way we can offload that expense till later, when it's needed.  We also make sure we don't keep doing the expensive operation by tracking with the `$this->started` variable.  We didn't need to do that with the constructor version because you don't construct the class more than once.

The problem with this approach is that you now have to remember to call `$this->start()` with every method that needs access to the expensive construction. It's not hard to _do_ but its _easy to forget_ to do.

#### Very Magic

The next thing we can do is use the magic methods in PHP to intercept the calls to our methods and do the construction if need be.  We're going to use the magic method `__call` which is what gets called (if it exists) when a method is called on an object that doesn't exist.

```php
<?php
class DanceParty
{
  protected $started = false;

  public function __construct()
  {}
    
  public function __call($name, $arguments)
  {
    if (!$this->started) {
      sleep(3);
      $this->started = true;
    }
        
    return $this->$name(...$arguments);
  }

  protected function doFunk()
  {
    $this->applyForPermit();
    // do things that can't stop the funk
  }

  protected function doMoshPit()
  {
    $this->applyForPermit();
    // somehow devolve into ring around rosie
  }

  protected function applyForPermit()
  {
    // I <3 Paperwork
  }
}
```

I did this:

```php?start_inline=1
$dp = new DanceParty();
$dp->doFunk();
```

Now, you'll notice something different here.  I had to change the methods for the dance party to protected.  When they're public, `__call` does not get executed because the method actually exists (publicly).  So, I had to make them protected for this to work.  The confusing part, now, will be that other developers will see what appears to be calls to protected methods as public methods.  If you want to document this, too, you'll probably have to use the [@method PHPDoc](http://docs.phpdoc.org/references/phpdoc/tags/method.html) annotation... for example:

```php?start_inline=1
/**
 * Class DanceParty
 * @method void doFunk()
 * @method void doMoshPit()
 */
class DanceParty
```

Another caveat, that is actually positive, is that the `__call` method won't get called repeatedly on the other method calls because they'll be 'found' once inside the context of the class.

#### Proxy Object

Using the [Proxy Design Pattern](https://en.wikipedia.org/wiki/Proxy_pattern), we can proxy the expensive object with another.  This functionality is similar to the previous solution, has some of the benefits and drawbacks.  However, this is very useful if you can't alter the code (if you're using a SDK) or someone has marked your class as `final` and you can't alter the functionality at all.

In this example, we're going to revert back to our original `DanceParty` and then create a proxy pattern below it.

```php
<?php
class DanceParty
{
    public function __construct()
    {
        sleep(3); // that's how long it takes
    }

    public function doFunk()
    {
        $this->applyForPermit();
        // whatever you do here...
    }

    public function doMoshPit()
    {
        $this->applyForPermit();
        // metal!!
    }

    protected function applyForPermit()
    {
        // I know, I'm lame.
    }
}

class DancePartyProxy
{
    protected $instance;
    
    public function __call($name, $arguments)
    {
        if (is_null($this->instance)) {
            $this->instance = new DanceParty();
        }
        
        return $this->instance->$name(...$arguments);
    }
}
```

I call it like so:

```php?start_inline=1
$i = new DancePartyProxy();
$i->doFunk();
```

Now, we work directly with the proxy.  It handles knowing if we've constructed the expensive object.  Then, it proxies forward our requests.  Again, this suffers from the fact that there are no other public methods on this proxy class, so it might be hard to know what to call. But, it doesn't require the original class to be modified at all.

Basically, you create a new instance of the proxy class.  Then, whenever you call a method signature from the original class, the `__call` method intercepts it, tests for object creation, then passes it forward.  Simple.

### Final Thoughts

These are just a few examples for handling the expense during construction of an object if you're not guaranteed to use it.  I'm sure there are more.  Even better, it'd be great to refactor your code in such a way that this wasn't necessary. However, that's not always possible.