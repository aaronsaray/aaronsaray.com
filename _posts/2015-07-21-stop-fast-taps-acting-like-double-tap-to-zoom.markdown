---
layout: post
title: Stop fast taps acting like double-tap-to-zoom
tags:
- javascript
- jquery
- mobile
---

I have been making a number pad on a webpage for mobile browsers - and one problem I kept running into is double tap to zoom'ing when I didn't want it.

So, basically, people were typing too fast on the screen's number buttons - and that would execute a zoom.  Turns out, with a little bit of jQuery, you can get rid of this annoying problem.  

{% highlight javascript %}
$(body).on('touchend', '.number-keys', function(e) {
    e.preventDefault();
    e.target.click();
});
{% endhighlight %}

Here, you just watch for touch-end on the body, limit that to your number-keys (or any selector you want), and prevent the touch end - and instead issue a click.  That way it'll work like a standard tap and not a double-tap and zoom.  
Keep in mind, it's probably best practice to only disable this on areas that need it - not the entire body - because then you're removing some of the usability of your page.
