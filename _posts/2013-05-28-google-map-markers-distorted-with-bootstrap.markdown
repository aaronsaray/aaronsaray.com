---
layout: post
title: Google Map Markers Distorted with Bootstrap
tags:
- CSS
---

On a recent project, the dev team installed [Twitter Bootstrap](http://twitter.github.io/bootstrap/) as the base for our CSS.  For some reason, I was the only one seeing a problem with Google Maps.  Their Windows and Mac browsers of both Chrome and Firefox were displaying the marker fine.  (Part of me doesn't believe that entirely but....).  At any rate, my Chrome browser on ubuntu was not showing the marker properly.  This is what it looked like:

![before](http://aaronsaray.com/wp-content/uploads/2013/05/before.png)

I finally tracked down that it was some default styles in Bootstrap that were causing the issue.  I added this rule to our css:

{% highlight CSS %}
#googlemap img[src^="http://maps.gstatic.com/"] {
  max-width: none;
}
{% endhighlight %}    


And, we were good to go.  Proof:

![after](http://aaronsaray.com/wp-content/uploads/2013/05/after.png)
