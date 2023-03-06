---
title: Intelligently combining Javascript
date: 2012-10-02
tags:
- javascript
- performance
---
One debate that the guys on my team have been having revolves around the combination of Javascript and CSS files.  There are two schools of thought.   The **keep them separate** and the **BFF - Big Fun File** system.  There are pro's and cons to both... but as with everything, one particular way may not always be the best - we don't always have to stay in extremes-land.  Here are some thoughts.  Feel free to weigh in.

<!--more-->

### Use a CDN

Remember, you can always use the CDN for your very familiar and shared libraries.  (I [think about this]({% post_url 2009-02-26-rely-on-google-for-your-javascript %}) a lot.)  And of course, if your CDN fails, you can always fall back [locally]({% post_url 2009-12-01-auto-failover-for-cdn-based-javascript %}).  But when you do this, you're generating another HTTP call which can slow down your site, right?  I used to be somewhat against this idea, but with the proliferation of sites using the shared CDNs, we don't actually have to issue that next HTTP.  A lot of your visitors might actually have this cached right on their system now and don't need to make that round trip.

### Combine Intelligently

Think about this with the famous Pareto Principle again - and use the 80/20 rule.  If the javascript is used on 80% of the pages or more, include it in one shared file.  If a particularly heavy page has a lot of Javascript, and is only used that one time in that one page, it makes sense to put it in a separate file.  After-all if it is that intense of a page, the extra little delay won't be that bad.  And if the visitor never visits that page, why would you have made them wait to download that code?  Another way I combine code depends on the general userbase of my community.  If say 80% are visitors who will never create accounts, but 20% do log in to a very AJAX rich interface, I'll create a 'user.js' file that has all logged in functions instead.
