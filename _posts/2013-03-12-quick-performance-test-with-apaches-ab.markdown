---
layout: post
title: Quick performance test with apache's ab
tags:
- apache
- performance
---

In a break from my normal type of tutorial, I just want to give a real quick overview and highlight of a fictitious "case study" to demonstrate the importance of load testing your application with apache's ab tool.

'ab' is the Apache Benchmark tool.  It allows you to run concurrent tests, limit the amount of times you send requests, send specific headers, cookies, authorization, etc.  Basically, you can set up scenarios for load testing your code with nearly any scenario you can imagine - on one page - with just a little prep work.

In my case study, I've created some PHP code for my profile test page.  I have a long running function that is running too long for my user experience.  Lets take a look.

{% highlight PHP %}
<?php     
function slowRunningFunction()
{
    echo 'Ok...';
    $waitTime = rand(1,3);
    sleep($waitTime);
    echo 'Done!';
}

slowRunningFunction();
{% endhighlight %}



Obviously, the sleep() method is the culprit here, but I want to prove it!  Lets test with a concurecy of 5 connections for a total of 20 tests.  (Each connection should run probably 4 times if everything is even).

Here is the output.

[![AB results](/uploads/2013/2.png)](/uploads/2013/2.png){: .thumbnail}

The important numbers on this page are the time taken for the test, the requests per second, the time per request, the connection times and the percentage of requests served within a certain time.

I obviously can see I have a problem here.  The 2 second mean time is just too much.

After some research, I found a new 'improved' method to replace in my code.  Instead of sleep(), I'm going to use usleep() (yup, this is cheesy).

{% highlight PHP %}
<?php
function slowRunningFunction()
{
    echo 'Ok...';
    $waitTime = rand(1,3);
    usleep($waitTime);
    echo 'Done!';
}
    
slowRunningFunction();
{% endhighlight %}
    



Now, lets look at the results.

[![AB Results](/uploads/2013/4.png)](/uploads/2013/4.png){: .thumbnail}

Now, if you look at the key metrics, you can see I've made considerable changes to the speed.  I could even ratchet up the number of requests and concurrency.  



#### The moral of the story


The code may look good on the surface, but its always important to know the facts of load testing.  At the very least, use a tool like ab to test your load on your sites.

