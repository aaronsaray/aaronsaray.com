---
layout: post
title: Understanding the Observer Pattern in PHP
tags:
- php
- programming
---
For a while, I've been looking at plugin systems, but not really fully understanding the pattern behind them.  Don't get me wrong, I see how they work, but I didn't know the reason why - the theory or pattern behind it.  Well turns out, generally, they're based upon the observer pattern.  I decided to write my own observer pattern demonstration here.

Our example is going to be very simple: post a message to twitter.  We're not going to work with any credentials or anything, just want to post a message.  I do want to add an observer that will shorten any url however.  In this example, we'll be making the logic classes stubs (you can create these later), and using `[url]` to stand for an URL we might replace.

Let's start in:

### Our two logic classes

Remember, we're just going to have some blank stub logic classes here.  They are for demonstration purposes only.

```php?start_inline=1
class twitterTransport
{
  public function __construct()
  { /** logic here **/ }

  public function tweet($object)
  { /** logic here **/ print $object->message . ' was just tweeted'; }
}

class urlShortener
{
  public function shorten($message)
  {
    return str_replace('[url]', '[u]', $message);
  }
}
```

Pretty simple, the first class all it does is post to twitter with a public method called `tweet()`.  This accepts an object of the twitter message (which we'll list next!).  It prints out the message so you know what we would have sent to twitter.  The url shortening class - all it is is your logic to shorten urls inside of a message.  In this case, pretty simple.

Ok - as promised, here is our twitter message class:

```php?start_inline=1
class twitterMessage
{
  public $message = '';

  public function __construct($message)
  {
    $this->message = $message;
  }
}
```

### The actual launching code

We're going to jump a head here and show what code we'll be using to add the url shortener as well as post the message.  It's really short - but it'll give us an idea of what class we need to create next:

```php?start_inline=1
$tweeter = new twitterTransportObservable();
$tweeter->registerObserver('PREPOST', new urlShortenerObserver());
$message = new twitterMessage("this is my message [url]");
$tweeter->postMessage($message);
```

Ok good.  First off, we create a new instance of `twitterTransportObservable`.  By the keyword `Observable`, we can tell that this class is something that will "do something we can watch" or observe.  Any time a class is `Observable`, it has to have a method to add watchers to itself - or `registerObserver()`.  In our example, we're sending in a type - `PREPOST` - so before we post the message, and a new object.

The new object is of type `urlShortenerObserver()`.  We can see that this will be a 'watcher' by the name.  No more details are given here, so its methods must be used/exposed inside of the `Observable` class.

Next, we're just making a new twitter message object, pretty simple.

Finally, we're calling `postMessage()` sending in our twitter message.  Remember, `$tweeter` is an instance of `twitterTransportObservable`, so there must be a method called `twitterTransportObservable::postMessage()`.

So far so good.

### Looking at the Observable Class

So now we know we need to build `twitterTransportObservable`.  I'm going to post the code here, but don't worry, we'll take it apart, step by step:

```php?start_inline=1
class twitterTransportObservable
{
  protected $_observers = array();

  public function registerObserver($type, $observer)
  {
    if (!isset($this->_observers[$type])) $this->_observers[$type] = array();
    $this->_observers[$type][] = $observer;
  }

  public function postMessage($object)
  {
    $this->_notify('PREPOST', $object);

    $sender = new twitterTransport();
    $sender->tweet($object);

    $this->_notify('POSTED', $sender);
  }

  protected function _notify($type, $object)
  {
    if (isset($this->_observers[$type])) {
      foreach ($this->_observers[$type] as $observer) {
        $observer->notify($object);
      }
    }
  }
}
```

Ok - pretty big - lets go slow:

First off, we have the `$_observers`.  Since this class is of type observable, we know it has watchers.  Well, it has to be aware of its watchers, because it registers them... so we need an array to hold all of our watchers, or `$_observers`.

The first method is `registerObserver()`.  You'll see this takes in a variable called `$type` and a variable called `$object`.  Well, we saw this used in our launching code.  It appears that this was started with `PREPOST` as the $type and a new `urlShortenerObserver` as the `$object`.  Moving along, the `$_observers` array is keyed by `$type` - so we just did some good programming: if the key is not set, set it by creating an empty array.  Finally, the next line grabs that array, and adds the passed in $object to the internal array of `$_observers`.  So now, our observable class has its first observer.  An important thing to note is that the order you add them using `registerObserver()`, is the order they will remain in the array in the Observable class.

**Quick reminder:** Remember, objects are passed by reference!

Next, we have the `postMessage()` function - which takes in an object of a twitter message.  The first thing the function does is notify our self that we're `PREPOST`, while passing in the `$object` to that notify call.  Think of this as the 'hook' - or someone yelling at the watchers saying "Anyone of type PREPOST, I've got this $object for you to deal with!".  Next, this function creates a new `twitterTransport` and tweets the object.  Remember, the `$object` has now returned from the notify call and may be changed.  Finally, there is another call to `_notify()` with `POSTED` as the type.  This is just for example, our example doesn't really need this.  But, imagine you created an observer which logged the output of twitter's response to your post?  This would be perfect for that hook.

Ok, so the last thing we have to look at is the `_notify()` function - which we've called a few times during our `postMessage()`.  This simply looks to see if there is an observer that we've been storing locally keyed on the $type key.  If there is a key of this `$type`, we loop through each observer of that `$type`, and pass in our object to its `notify()` function.  OK - don't get confused, that `notify()` function is different than our `_notify()` function.  It belongs to the observer (in our example, `urlShortenerObserver::notify()`).  So basically, it calls all the observer's `notify()` with a reference to the object, and its done.

Whew, that was a lot - but we have one more part left:

### The Observer class

We have another class that is used to observe or watch the observable classes.  In this case, we wanted to have any URLs shortened before we posted a message to twitter... so we registered this observer with `PREPOST`.  During the Observable's `_notify()` function, we called this observerable class's `notify()` method.  So, lets finally take a look at the code:

```php?start_inline=1
class urlShortenerObserver
{
  public function notify($object)
  {
    $urlShortener = new urlShortener();
    $object->message = $urlShortener->shorten($object->message);
  }
}
```

Pretty simple class.  It has only one method, called `notify()` which accepts an object - of type `twitterMessage`.  The first line just creates a new `urlShortener()` - you remember from way up top?  Just a quick `str_replace` type method.  Then, the next line accesses the `urlShortener::shorten()` method - by passing in the public `$message` variable of the `twitterMessage`.  The return value is assigned to the `twitterMessage::$message` var.  And remember, since objects are passed by reference, when the next line of the the observable's class is called, the object will now be modified.

### Wrapping Up

Ok - well this was a pretty simple example of this behavior.  There are definitely more complex ways and more business logic intense scenarios to use the observer in.  Another thing we didn't do is use many of PHP's OO properties - but we could always refactor and do that in the future.

### All the code

In case you want to run it yourself:

```php?start_inline=1
class twitterTransport
{
  public function __construct()
  { /** logic here **/ }
    
  public function tweet($object)
  { /** logic here **/ print $object->message . ' was just tweeted'; }
}
    
class urlShortener
{
  public function shorten($message)
  {
    return str_replace('[url]', '[u]', $message);
  }
}

class twitterMessage
{
  public $message = '';

  public function __construct($message)
  {
    $this->message = $message;
  }
}

class urlShortenerObserver
{
  public function notify($object)
  {
    $urlShortener = new urlShortener();
    $object->message = $urlShortener->shorten($object->message);
  }
}

class twitterTransportObservable
{
  protected $_observers = array();

  public function registerObserver($type, $observer)
  {
    if (!isset($this->_observers[$type])) $this->_observers[$type] = array();
    $this->_observers[$type][] = $observer;
  }

  public function postMessage($object)
  {
    $this->_notify('PREPOST', $object);

    $sender = new twitterTransport();
    $sender->tweet($object);

    $this->_notify('POSTED', $sender);
  }

  protected function _notify($type, $object)
  {
    if (isset($this->_observers[$type])) {
      foreach ($this->_observers[$type] as $observer) {
        $observer->notify($object);
      }
    }
  }
}

$tweeter = new twitterTransportObservable();
$tweeter->registerObserver('PREPOST', new urlShortenerObserver());
$message = new twitterMessage("this is my message [url]");
$tweeter->postMessage($message);
```
