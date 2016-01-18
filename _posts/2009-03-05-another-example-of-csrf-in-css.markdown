---
layout: post
title: Another example of CSRF - in CSS
tags:
- CSS
- javascript
- security
---

Just saw this really cool example get submitted on one of my websites testing for CSRF:

{% highlight CSS %}
#logo{background:url(deletepost.process.php?id=12345&userID;=12345);
{% endhighlight %}
    
Just another great example of why you should

1) not use GET for irreversible changes

2) filter filter filter! (I edited that posting, it was a filtered by my script already...)
