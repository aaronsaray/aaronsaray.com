---
layout: post
title: Auto Failover for CDN based Javascript
tags:
- javascript
- jquery
- Misc Web Design
---

Using my [javascript error reporter](/blog/2009/09/23/javascript-error-handler) code helps me get a better understanding of what my clients are experiencing when visiting my website.  One thing I did notice was the failures from time to time of Google's CDN based Jquery.

To solve this issue, I decided to keep a local copy as well.  For the most part, Google's version is going to be faster and have a better cache method.  However, I'd rather have an uncached version of it loaded into the user's browser than nothing at all!  So, in the very rare case that the user's browser fails to load the Google javascript, I load a local copy of it.

#### First Step: Load JQuery From Google

The very first thing I do is to include jQuery from google's code base using the following tag:

{% highlight HTML %}
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" type="text/javascript"></script>
{% endhighlight %}

This will retrieve the latest version (1.3.2) from Google with the proper compression and cache response I like.

However, this sometimes was failing - well according to my error reporting script.  What to do?

#### Test for a successful load of jQuery

Since the SCRIPT tag does not have an 'onerror' standard notifier like our image, the next best thing to do is test for the jQuery object right after the page loads.  Since we're using inline javascript, the first request to the external javascript will block while loading.  When it completes, this small snippet will then execute.

I'll jump ahead one more step though before code.

#### If no jQuery found, load it dynamically

If the jQuery object is not found, a new script element is created dynamically.  The source is pointed to my local version of the script.  Finally, it is appended to the head.  Hopefully this will load the jquery.  If it fails here, well then - the client has some issues!

This is the full inline javascript after the external javascript reference:

{% highlight javascript %}
if (typeof jQuery == 'undefined') {
    var e = document.createElement('script');
    e.src = '/js/noncdn-jquery-1.3.2.js';
    e.type='text/javascript';
    document.getElementsByTagName("head")[0].appendChild(e);
}
{% endhighlight %}
    
In this case, the path http://mydomain.com/js/noncdn-jquery-1.3.2.js contains my local javascript.

#### The results?

Before this fix, I saw a failed jQuery load about once a day.  I have not seen a single one yet.  I have yet to see this error reported.  If anyone finds a better way to do this, please let me know!
