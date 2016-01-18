---
layout: post
title: Load Time Analyzer for Firefox
tags:
- IDE and Web Dev Tools
- performance
---

So, I started looking at a few load time analyzers for my sites - and I found an interesting plugin for firefox.  I wasn't too entirely sure what I was going to find - but I figured I'd try it out and figure out if it was useful.

My test site will be [JEMDiary](http://www.jemdiary.com) -  mainly because I know ALOT about it. ;)  I could have used a local website, I'm sure - but a remote site was going to give a better load time analysis.  JEMDiary's homepage is a static HTML file (generated periodically behind the scenes).  It loads a few external js and css files, and a set of images as well.  The images in the images directory send headers to cache themselves, and so do the css and js files (interestingly, if the front page had specific profile images, they would not be cached...)  At any rate, I wanted to test a fresh load on the site, and then a cached one - and see what I can determine from these load times.

Lets go...

[Load Time Analyzer - Firefox Add-on.](https://addons.mozilla.org/en-US/firefox/addon/3371)

There is not a lot of documentation with this plugin.  You need to figure out from the context of the options how everything will work - so here are my best guesses...

First of all, when the plugin is installed, it automatically enables itself, and puts a toolbar on the top of the screen.  It seems to continue to add on more and more results each page - until you hit the clear button.  Additionally, the configuration drop downs allow you to decide which events you want to record.  Finally there is a graph button that generates a new window with your results in it.  You can show which items that you'd like to show on the graph, if you'd like to label them, and what percentage of zoom you want.  (I went out to 10% so that I could fit the results on one page).

The following is the results for loading the page brand new.  You'll notice it took 1750ms to load the front static html page (Um, my particular host sucks at mysql - so the internal pages take alot more than that - anyone want to help spring for a vps or dedicated server? heh).

[![Load Time Analyzer - Test 1](/uploads/2007/test-1-load-time-analyzer.thumbnail.png)](/uploads/2007/test-1-load-time-analyzer.png){: .thumbnail}

Then, I went to a different website, and came back.  You can see the difference in the speed for cached items.  437ms - so much better.

[![Load Time Analyzer - Test 2](/uploads/2007/test-2-load-time-analyzer.thumbnail.png)](/uploads/2007/test-2-load-time-analyzer.png){: .thumbnail}

The important thing to notice is that you can determine state changes and individual resource speeds and load time.  I like that ALOT.

There was some confusion on all of the extra items that I could view.  There was also no documentation.  I did like the fact that I could click on the resources and view them myself as well.  The other thing I don't like is the fact that the results and times seem to add up.  I would like to be able to enable that feature, not have it the default behavior... sometimes you forget to reset the timer... so it becomes annoying.

So, all in all - it looks like some useful features, but it could take some work at making it more user-friendly.
