---
layout: post
title: PHProblemLogger Filter Strategies
tags:
- php
---
If you haven't been following my [twitter](https://twitter.com/aaronsaray) feed or my [open source on github](https://github.com/aaronsaray), you might not have seen that I recently released [PHProblemLogger](https://github.com/aaronsaray/PHProblemLogger), an environment and run-time logger designed to help log everything during an error condition.  

One of the goals of the project was to build in particular environment and application logging options, but not to just dump everything into your log files.  That can be overwhelming.  For more details, you should [RTFM](https://github.com/aaronsaray/PHProblemLogger), but the tldr; is you can do filtering and error handling like this:

{% highlight php %}
<?php
$handler = new Handler(new Logger());
$handler->server(function(array $payload) {
  return $payload;
});
{% endhighlight %}

This would filter the `$_SERVER` super global and basically return the entire thing.

In the cookbook section of the documentation, I gave a bunch of examples of how some filtering might work - but I thought I'd jump in a bit here with more detail of some examples.  And, we'll end it with my favorite thing - not re-inventing the wheel (that is, using built-in PHP functions as you should be!)

### Examples

The filtering functionality of the PHProblemLogger library takes a `Callable` from PHP and basically executes it.  It stores the output.  So, we can duplicate this logic by simply creating user defined functions and maybe using `var_dump` to look at the answer.  This way we don't have to call specific filter functions on the class - we'll use `$_SERVER` and bypass some of the other logic in the class.

**Get all of the contents of the array**  
This first example, I just covered above.

{% highlight php %}
<?php
$filterAll = function(array $payload) {
  return $payload;
};

var_dump($filterAll($_SERVER));
{% endhighlight %}

This is going to create something that looks similar to this:

    array (size=24)
      'DOCUMENT_ROOT' => string '/Users/aaron/Desktop' (length=20)
      'REMOTE_ADDR' => string '127.0.0.1' (length=9)
      'REMOTE_PORT' => string '58854' (length=5)
      'SERVER_SOFTWARE' => string 'PHP 5.5.34 Development Server' (length=29)
      ...
      
A total of 24 keys in this particular instance of my `$_SERVER` variable.

Moving forward, I'm not going to include my `var_dump()` statement.

**Get only one value**  
In this example, I only want one of the values.

{% highlight php %}
<?php
$filterOnlyOne = function(array $payload) {
  return [
    'REMOTE_ADDR' => $payload['REMOTE_ADDR']
  ];
};
{% endhighlight %}

All I did is create a new array and pick a specific portion of my incoming array to return.

The output is rather predictable:

    array (size=1)
      'REMOTE_ADDR' => string '127.0.0.1' (length=9)

**Filter out only one key**  
Let's say we have a particularly delicate value in this incoming variable.  Yup, we don't want anyone to see `REMOTE_ADDR` (for some reason? Let's just use it for this example...)

{% highlight php %}
<?php
$filterOutRemoteAddr = function(array $payload) {
  if (array_key_exists('REMOTE_ADDR', $payload)) {
    unset($payload['REMOTE_ADDR']);
  }
  return $payload;
};
{% endhighlight %}

This will unset the value of my desired key if it exists in the payload.  (Remember, you don't want to unset something that might not be there!)

The output is basically the same as the first example, but 23 keys (because `REMOTE_ADDR` is missing).

**Return only a few keys**  
I'm sure I could write my own function to handle this similar to how I've been doing the above ones - but I wanted to use something that's built into PHP.  (I'm going to be using `var_dump` again here, just for illustrative purposes.)  I want only keys `REMOTE_ADDR`, `HTTP_HOST` and `REMOTE_PORT` out of my payload.

{% highlight php %}
<?php
var_dump(array_filter($_SERVER, function($key) {
  return in_array($key, ['REMOTE_ADDR', 'HTTP_HOST', 'REMOTE_PORT']);
}, ARRAY_FILTER_USE_KEY));
{% endhighlight %}

This is pretty cool because we're filtering our array using a built-in function.  `array_filter` removes an element if the callback returns false.  So, in this case, since we don't care about values - just keys - we use the `ARRAY_FILTER_USE_KEYS` flag as well.  

As you can probably guess now, this returned the following output:

    array (size=3)
      'REMOTE_ADDR' => string '127.0.0.1' (length=9)
      'REMOTE_PORT' => string '58854' (length=5)
      'HTTP_HOST' => string '127.0.0.1:8888' (length=14)
      
**Oh noes! Passing `ARRAY_FILTER_USE_KEYS` is always giving me a `null` array?! Help!**

This is most likely because you're on a version of PHP less than 5.6.  Here is an alternative version of that filter that will work on an older version of PHP:

{% highlight php %}
var_dump(array_filter($_SERVER, function($value) use (&$_SERVER) {
  $key = key($_SERVER);
  next($_SERVER);
  return in_array($key, ['REMOTE_ADDR', 'HTTP_HOST', 'REMOTE_PORT']);
}));
{% endhighlight %}

In this example, for versions less than PHP 5.6, we're passing by reference our `$_SERVER` variable.  By the time you do this, it might just make more sense to write your own function instead - probably a little easier to read.
