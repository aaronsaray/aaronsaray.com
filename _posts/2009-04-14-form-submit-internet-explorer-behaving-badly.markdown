---
layout: post
title: 'Form Submit: Internet Explorer behaving badly'
tags:
- html
- javascript
- jquery
---

I just want to make a micro blog here.  Just a tiny lil blog.

#### Internet Explorer Does Not Submit Form on Enter

Correct!  Instead, I load my page with this jquery

{% highlight javascript %}
$('input').keydown(function(e){
    if (e.keyCode == 13) {
        $(this).parents('form').submit();
        return false;
    }
});
{% endhighlight %}
 
    
#### Button Element Not Submitting in Internet Explorer

Correct!  Mainly because I was lazy.

But in FireFox  works fine for a submit.

In IE - don't forget to add type="submit"

{% highlight HTML %}
<button>Works in FF</button>
<button type="submit">Works and is probably what you SHOULD do</button>
{% endhighlight %}


That is all.
