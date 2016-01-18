---
layout: post
title: Figuring out Price Before Tax
tags:
- javascript
---

A lot of the time I give quotes including taxes.  Every once in a while, someone is curious about what the tax is on a service.

I was messing around the other day and came up with this Javascript function.  It takes in the total amount, the tax in percent, and returns the cost before tax.

{% highlight javascript %}
function figureBeforeTax(amount, tax)
{
    return Math.round((amount)*(100 / (100 + ((tax/100)*100)))*100)/100;
}
{% endhighlight %}
