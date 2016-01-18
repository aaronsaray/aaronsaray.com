---
layout: post
title: Duplicate request issued in ZF when using inline script/document.writeln in view
tags:
- PHP
- zend framework
---

This is a weird one...

I had a form in the body of my page.  Every time I would submit it, the csrf token would not match.  

I finally thought it must be hitting the page one more time (I've had a problem like this before when image sources didn't load...)... and sure enough, same issue.

In this case, however, I was found the following code:

{% highlight HTML %}
<script>
document.writeln('<img class="album-cover" alt="" src="#" style="display:none;" />');
</script>
{% endhighlight %}


When I viewed the network tab in chrome, turns out it was issuing another request to my URL for some reason.  Once this code was removed, it was good to go.
