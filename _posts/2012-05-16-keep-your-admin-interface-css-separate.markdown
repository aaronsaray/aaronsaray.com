---
author: aaron
comments: true
date: 2012-05-16 15:14:53+00:00
layout: post
slug: keep-your-admin-interface-css-separate
title: Keep your Admin Interface CSS Separate
wordpress_id: 1031
categories:
- CSS
- performance
- security
tags:
- CSS
- performance
- security
---

There are a number of performance arguments about combining assets to reduce HTTP requests and speed up your site.  I agree!  However, I do have to say that there is such a thing as overkill - to the detriment of speed and security... 

**Keep your admin interface CSS separate from the rest of your CSS.**  

There are a number of reasons to do this:




  * **Security:** In CSS, a number of class names and IDs are revealed.  And, if you're programming your code semantically, they should be pretty explanatory (see: verbose).  This exposes the names/interfaces/code structure and featureset of your administration interface to anyone who can look at the CSS.  Not Good.


  * **Extra space / slows down the interwebs:** Let's face it, more than 99% of your userbase should be normal users, right?  Why add on all this extra CSS just for the 1% of users.  Keep it trim and fitting the 99% of users.  This is 19% better than Pareto's principle even!


  * **Another HTTP request for admin is fine...** Usually when you're logged into the administration side of things, you're not expecting lightning fast results anyways.  And to top it off, you're no longer (and never were) a conversion.  Speed and usability matters much more for your conversion statistics (IE, this user may leave because the site is too slow).  You're not going to abandon your own site because your admin interface is too slow, are you?  (True, though, that's not me just giving you free-for-all to make horribly slow admin interfaces though...)



