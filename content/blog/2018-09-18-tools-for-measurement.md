---
title: Tools You Need for Measuring Everything and Anything
date: 2018-09-18
tags:
- php
- mysql
- programming
- misc-web
---
Measurement is important. Metrics, while not sexy, are concrete to a good business strategy. When you bring a problem to your superiors, they're going to want to know what is your measurement, what metrics did you use to determine this is a problem. With tasks I've given developers, I've always said "show me the metrics that your fix is better" versus just looking at the code.

<!--more-->

**Measurement is as important as good code.** 

A lot of times we might think it's time to optimize or change a process. This just doesn't "feel right" we say.  But what is wrong, and to what level? How do we know we need to prioritize this change over something else? And, even historically, has this been changing, trending, in an alarming way?  We need to develop metrics and measurements.

**This is not a how-to article.** This is just an introduction to *some* tools you can use to create the measurements you need to be successful and prove a point. Now that you know about them, its your job to read more and start using them!

### XDebug Profiling, Tracing and Cachegrind

One of my favorite tools we have for PHP is [Xdebug](https://xdebug.org/).  Most people are familiar with this tool because of it's ability to create debugging connections (or at the very least, colorize a var_dump()).  But there are so many more things it can offer.

First, we have the "gimme" of a good [stack trace](https://xdebug.org/docs/stack_trace) - which you're probably familiar with.

But, then comes [functional execution tracing](https://xdebug.org/docs/execution_trace).  This basically is a complete output of all functions called, in what order, and optionally their incoming parameters and return values.  Human readable and machine parsable options are available.

Finally, the holy grail, [profiling of PHP Scripts](https://xdebug.org/docs/profiler).  This not only tops tracing, but it can show memory usage, number of function calls, call times, and more.  Need a good good tool to view the cachegrind files?  There are some on the manual page, or you can even use [PHPStorm](https://confluence.jetbrains.com/display/PhpStorm/Profiling+PHP+applications+with+PhpStorm+and+Xdebug#ProfilingPHPapplicationswithPhpStormandXdebug-3.1.Opentheprofilersnapshot).

### HTTP Time Consumed by Guzzle

If you're in the PHP world and you're consuming remote APIs, you are most likely using [Guzzle](http://guzzlephp.org/).  We have tools in our arsenal to track our time, but what about our remote endpoints? Its important to develop a measurement and benchmark of how long third-party sites take to provide the information. Guzzle has your back.

Guzzle provides a [request option called on_stats](https://guzzle.readthedocs.io/en/latest/request-options.html#on-stats) that allows you to inject a callback function to retrieve the stats of this call.  You can use something like the method `getTransferTime()` on  `GuzzleHttp\TransferStats` to get the time from the request.  Now, start developing your third-party response time trend lines.

### MySQL Query Explanation

If there's one thing I can't stand, its someone starting to debug a MySQL query by just looking at the joins.  Or, worse, they "prove" their solution is better/faster because it seems to return the query results faster in their query browsing tool.  (Let's not take into account query cache, network latency, etc).  So, if you have some poor performing MySQL queries, what can you use to measure them?

The first and very obvious answer is the [MySQL Slow Query Log](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html).  This can be configured to log queries that take longer than # amount of seconds.  Great - now you've measured that some queries are taking longer.  But, what do you use to measure why exactly?

Enter [MySQL's Explain Syntax](https://dev.mysql.com/doc/refman/8.0/en/explain.html).  This allows you to see a huge amount of information about the query and what the engine is going to do to get your result for you.  You'll find out if its using indexes (and which ones), the amount of results it has to parse, if there are filesorts and temporary tables being used, and more.

`EXPLAIN` can be used to troubleshoot and measure your current query - but its also a great tool to measure your suggested updates.  Does your new query search less records? Does it no longer need to write data to a temp query? Explain your changes. 

### Browser-side Performance Measurement

With larger and larger sites and the rise of the mobile browser, its important to optimize client-side as well.  (You're using Google Analytics to [measure mobile](https://neilpatel.com/blog/mobile-metrics/) visitor rates, right? Or at least a similar product, yes?)

By now, most of us are familiar with the whole refresh the page and watch the [network tab in dev tools](https://developers.google.com/web/tools/chrome-devtools/network-performance/) dance, right?  That's great. It's really interactive and they've built a lot of filtering in.

But, what if we need to keep some of those metrics for later? Or we want to compare old versions of our site's performance to our new stuff? Or we even want to get some insight from a colleague without exposing the actual site to them?

The [HTTP Archive format](https://en.wikipedia.org/wiki/.har) is a JSON file that contains this logging. Then, you can use a tool like the [HAR Analyzer](https://toolbox.googleapps.com/apps/har_analyzer/) to get some better insight. (Remember, a HAR can expose some sensitive information, so take care with what you upload.)  Now, you can have snapshots of your client side performance. Measurements and trends, here we come!

### Server Side Measurement

Server-side measurement is a huge and wide-ranging topic. Don't let the depth and breadth of the topic sway you from implementing it, though.  Your servers and sites are running 24/7 - but you aren't (ah, that pesky sleep).  Plus, you might not be able to measure everything in real time accurately.  That's why you should get a server-side measurement and monitoring solution.

Two that I have used before are [Zabbix](https://www.zabbix.com/) (my favorite) and [Nagios](https://www.nagios.org/) (one of the most popular).  These tools are going to help you develop dashboards and alerts for common measurements on your system. You could watch bandwidth, diskspace, load, and so much more.

But they don't stop there. You can set some of these up to watch other parts of your application.  For example, in Zabbix, I set up a watcher that would make sure I had at least 3 workers running at all times in my gearman pool.  Another thing I configured was an alert for a new line in my error logging file (or you could use something like Sentry or BugSnag).  The point is, these monitoring solutions are more than just the examples that come in the box.

### There are Many More!

There are many more ways to measure things. Measurement and metrics are important. These were just some examples of things that can be used to monitor and develop metrics.  What are you waiting for?