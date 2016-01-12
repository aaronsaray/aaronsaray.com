---
author: aaron
comments: true
date: 2012-04-03 15:20:09+00:00
layout: post
slug: service-profile-mketweeps
title: 'Service profile: mketweeps'
wordpress_id: 1137
categories:
- business
- Misc Web Design
- site profile
tags:
- site profile
---

Goal: I came up with an idea that I wanted to find local people in our area and mention them using a twitter bot.  Pretty simple.  Two requirements were they either had to use the word milwaukee in their profile or be from the milwaukee location, and they had to not have a blank profile.  The tweet contained a shout out to their name and as much of their profile as could be fit in the tweet.

Technology used:
Zend framework command line cron job.  Once an hour it ran.  Pretty simple using the Zend Framework OAuth stuff.  (Originally I was using the first version of the API to twitter - so I used standard HTTP requests).  

Lessons learned:
-Stay current when APIs change. I ignored the oAuth change at twitter and had a bot that was not functioning for a long time.
-Follow the people you mention.  Very little people followed the bot even though they were mentioned.
-Lots of replies ... ok so that isn't such a 'lessons learned' but a "what should I have done about that"
-monetization.  What if I had grown a large collection of followers. Now what?
-Personal account: I should have followed people that replied to the bot.  I generally ignored all the tweets even.  Pay more attention!

_screenshots_
[![](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-18-203832-150x150.png)](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-18-203832.png)
