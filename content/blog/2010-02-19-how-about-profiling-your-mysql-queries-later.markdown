---
title: How about profiling your mysql queries... later?
date: 2010-02-19
tags:
- mysql
---
So the other night I was thinking about using xdebug on my PHP code.  I then totally had a brain explosion:  I'm always forgetting to profile my MySQL queries.  `explain` is a great command for this.  However, as the lazy programmer I am, I don't know if I'm always going to do this on all of my queries.  In an attempt to save myself time, I started brainstorming an idea.

<!--more-->

**What if I extended my MySQL class to capture unique queries so I could run explain on them later?**

### You should profile your queries when you write them

Well, you really should.  Check out the [Explain Mysql Page](http://dev.mysql.com/doc/refman/5.0/en/using-explain.html) for more information on how to do this.  However, this is not always possible.

  1. You may be using a 3rd party or open source software application.  Then, you didn't write the queries.

  2. You FUBAR'd and forgot to do this - or got lazy - or blamed deadlines for being sloppy.

Either way, you may not have been able to do the optimization ahead of time.

### Collect your queries

So the next thought I had was to extend my database classes to capture these queries.  My goal is to grab all of the queries that are uniquely ran on my site and profile them.

Depending on the constants used in the query, however, each query may be different so you'll just be logging all of your queries.  Prepared statements may help cut down on this - but you still need to capture some of the input.  So, your logging mechanism has now become more complex.

For those non-prepared statements, I think you could use tools like PHP's [Similar Text function](http://us.php.net/manual/en/function.similar-text.php) to determine if the query is indeed different enough to be logged.

### Automate it

The last thought I had is to automate the process.  Wait until there is a significant amount of new queries (or queries you've marked to be re-analyzed) to be explained.  Then, have the process run during the middle of the night.  All of the explains are ran on the queries and the complete result is sent to your email address.  This way, the next morning, you can have your coffee while optimizing your statements! woo!

### Your thoughts

Does something like this already exist?  Is this a good way to retroactively deal with the situation? I'm curious what you think.
