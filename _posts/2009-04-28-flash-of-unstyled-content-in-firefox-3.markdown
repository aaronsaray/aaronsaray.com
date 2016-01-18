---
layout: post
title: Flash of Unstyled Content - in FireFox 3
tags:
- CSS
- html
- javascript
---

So I've heard of the [Flash of Unstyled Content](http://bluerobot.com/web/css/fouc.asp/) before - but never really had this problem.  I always use a LINK tag for my stylesheets.

However, I just ran into it today - in FireFox even with a LINK tag...

#### Fixing Flash of Unstyled Content in Firefox

Simple really - I was loading way too much javascript before my stylesheet (not my fault on the large amount of js!!) - and the delay was causing the flash.  I moved the link to the very first part of the content - and presto - good to go.

So, **instead of**
    
{% highlight HTML %}
<head>
    <script src="#"></script>
    <script src="#"></script>
    <script src="#"></script>
    <script src="#"></script>
    <link href="#" type="text/css" rel="stylesheet"></link>
</head>
{% endhighlight %}
    

**Just move it to the top:**

    
{% highlight HTML %}
<head>
    <link href="#" type="text/css" rel="stylesheet"></link>
    <script src="#"></script>
    <script src="#"></script>
    <script src="#"></script>
    <script src="#"></script>
</head>
{% endhighlight %}
    
... next battle, getting rid of sooo much js ;)
