---
title: Jekyll Mark Old Posts
date: 2016-05-31
tag:
- jekyll
---
With technology changing so rapidly and people in such a big hurry, sometimes older suggestions or out of date recommendations
are the first things that programmers run into.  You know you've fallen for it - a quick google search and you get your first
result and you give it a shot; never mind that it's a blog entry from 7 years ago.

<!--more-->

Now, I would argue that that's your fault - you should be keeping an eye on the date.  But, I've decided that the best thing
to do for visitors is to remind them that this content is older.

When I was using WordPress, I made a plugin called [Label Old Posts](https://wordpress.org/plugins/label-old-posts/) - but now I use Jekyll for 
my blog.  I could go the route of making a plugin, but you'd still have to use some sort of 'shortcode' type syntax to get
the notification in the proper location in your theme.  Instead, I decided to just add code to my post template.  

Here's the liquid code:

```liquid
{% raw %}{% capture now %}{{'now' | date: '%s'}}{% endcapture %}  
{% capture postDate %}{{page.date | date: '%s'}}{% endcapture %}  
{% assign difference = now | minus: postDate %}  
{% if difference > 47340000 %}  
  <div class="old-post">  
    This post is more than 18 months old. Since technology changes to rapidly, 
    this content <em>may</em> be out of date (but that's not always the case).  
    Please remember to verify any technical or programming information
    with the current release.
  </div>  
{% endif %}{% endraw %}
```  

First, capture the current date and the post date as unix timestamps.  Then, do a calculation to figure out the difference.
I'm using a separate variable here because it makes it easier to do math, comparison, and it converts nicely to an integer from a string.
Finally, compare the difference to the number of seconds in 18 months.  If the difference is greater, display a message.