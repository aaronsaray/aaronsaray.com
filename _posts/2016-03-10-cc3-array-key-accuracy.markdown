---
layout: post
title: Array Key Accuracy
tags:
- php
---
> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.

### Episode 3: Array Key Accuracy

Bugs in code suck.  It's bad enough when you misspell a function or forget a semi-colon.  That's embarrassing and annoying.  But what's worse is when you write code that seems to work fine, is syntactically correct, yet still has a bug.  You know you did it right, but somehow it's also wrong.  That's not good.  That makes me paranoid and second guess the rest of my work.  That doesn't help me be a Confident Coder at all.

#### Enter the Array
One of the areas that I've seen this happen before is with array key and values.  Things can be written in proper PHP, but the actual execution fails.  And by fails, I don't mean provides a cool fatal error message or exception.  I just mean it didn't run the proper process or the assumed value of a calculation was different.  

So, let's take a look at one way this can happen.  In this example, if my array of a person's data has a zip code, I know that I want to execute some localization code in my application.

{% highlight php %}
<?php
if ($person['zip']) {
  runLocalization($person);
}
{% endhighlight %}

In this very simple case, this code will work very well for us (or the most part).  If the zip code is specified, we run localization.  If the zip code is NULL, an empty string or 0, the localization will not occur.  The only potential negative is the `E_NOTICE` error that will be generated if this array key happens not to be set.  (Confident Coders have their error notices displaying, though, and this will drive them crazy to see this error.)  The point here is that the code is done in the proper PHP format and syntax, but the application logic is very loosely implemented.  What if 0 becomes a valid zip code some day?  What if the array starts not having the zip property defined?  Neither of these scenarios are likely.  However, the bug that would result from any small changes to this code would definitely not inspire confidence about the accuracy of this application.

#### A More In-Depth Array Example
In this next example, we're going to deal with publication dates for printable items and their PDF sources.  (I believe the best examples come from our every day work; this was a problem I had to solve earlier this year.)  These PDFs become available to a data repository up to 5 days before the actual printing and publication date.  In some cases, the website will display the PDF as soon as it's available.  Other times it may show it on the specified publication date.  There is another option to post the PDF up to 2 days early or 2 days after the publication date.

To set this up, we have an HTML select that builds a drop down to reflect this choice.  The possible values that we can receive are reflected by this array:

{% highlight php %}
<?php
array(
 'Immediately'      => NULL,
 '2 Days Before'    => -2,
 '1 Day Before'     => -1,
 'Publication Date' => 0,
 '1 Day After'	    => 1,
 '2 Days After'     => 2
)
{% endhighlight %}

When it comes time to process the current page, the submitted value from this array is stored in a settings array using a key named `offset`.  So, for example, if we had a setting of `1 Day Before`, it would be reflected like this:

{% highlight php %}
<?php
$settings['offset'] = -1;
{% endhighlight %}

Now, let's take a look at our initial statement from the previous section updated to calculate publication date offsets.  Remember, if my offset setting doesn't exist, I don't want to run the calculation code.

{% highlight php %}
<?php
if ($settings['offset']) {
  calculateOffset($settings['offset']);
}
{% endhighlight %}

Obviously this will fail now because of the potential values of NULL and 0.  (Plus, keep in mind it still has the issue where it doesn't verify that the array key actually exists.)  

The first way that you might try to fix this is by using the PHP function `empty()`.  This will both validate that a value is not nothing and won't generate an error on a non-set array key. It's like a shortcut.  It allows me to easily do my comparison on empty value without having to check to see if the array key exists.  However, there is a big problem with this.  `empty()` will return TRUE for the following values: empty string, 0, and NULL.  That's no good as we're using two of these possible values!

The next way you might attempt to become more accurate and fix this is by using `isset()`.  If you check `isset()` using the array key, you'll finally fix that pesky problem where 0 shows up as empty.  This works a little better, but we're still stuck.  `isset()` will return false on keys with a NULL value.  

Enter our hero: `array_key_exists()`.  This function will accurately determine if the key exists in the settings array regardless of the value.  In other words, it does not try to calculate the existence of the array key by evaluating the value.  Our new code:

{% highlight php %}
<?php
if (array_key_exists('offset', $settings) {
  calculateOffset($settings['offset']);
}
{% endhighlight %}

### End Notes
Accuracy is important in programming.  A Confident Coder is never happy with "it's good enough." That generally means this code will work until it doesn't.  That's no way to build a robust, strong application.  Programming accurately and using the right methods may take more investment and time.  But, in the end, accuracy always wins out.  
