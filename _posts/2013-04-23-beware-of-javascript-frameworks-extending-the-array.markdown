---
layout: post
title: Beware of Javascript frameworks extending the Array
tags:
- javascript
---

Just a little fun for today... 

MooTools, a common Javascript framework, is responsible for [extending an array](http://mootools.net/docs/core/Types/Array) in Javascript.  It adds a number of useful features to each array that is created.

However, this can be a problem.  When creating a third-party javascript widget, I created an array of properties that needed to be iterated through.  I obviously cannot depend on a specific Javascript framework to be present... so I did something like this:

{% highlight javascript %}
for (x in myArray) {
    doSomethingWith(myArray[x]);
}
{% endhighlight %}


Well, since each array - on creation - has the methods from the prototype being extended, I now have extra items in my array.  This was causing an error because my function was not expecting a function to be passed in, only a string.

So that's why this is bad.  So don't do that in Javascript, ok? Thanks! :)
