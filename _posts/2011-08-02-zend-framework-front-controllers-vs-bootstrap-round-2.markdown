---
layout: post
title: 'Zend Framework Front Controllers vs Bootstrap: Round 2'
tags:
- zend framework
---

_This article is the follow-up to [the original article]({% post_url 2011-05-24-zend-framework-bootstrap-vs-front-controller-plugin %})._

There was some discussion on Twitter regarding the original version of my article about putting most of your site's setup in the front controller plugins in Zend Framework.  However, I haven't seen a lot of real reasons except for "that's what the example says" or "this is how I feel."  These suggestions I have are based on performance and logical reasons.  However, I could be wrong or maybe I was unclear. So I did a bit more research and I have just a few more notes.

### When Initializing Site in Front Controller, Use the Proper Hook

So I started examining my example code.  I noticed how I added a lot of code to the routeStartup().  My initial thought was that almost everything should be here.  Perhaps I define routes depending on the permission of the current user.  I need to initialize my ACL right away to know if I can allow access to other resources.  I also wanted to make sure the view was available because certain controllers could update or modify it.

But, I realized I was piling too much stuff into the method.  Let's think of this example:

  1. User visits site.com/admin

  2. Front Controller plugin launches before we determine the route and initializes all items for this admin page.

  3. ACL Plugin or Admin Controller init() method determine that the user doesn't have access to this page and sends a redirect.

  4. User is redirected to site.com/login and the entire process from #2 begins again.

Well this doesn't sound too bad until I realized that I initialized my view settings and other resources before I issued a redirect.  This shouldn't be.  Instead, I should have been smarter about this.  

### What Should Go Where in the Front Controller Plugin Site Initialization

First, **routeStartup** should have all the resources that will always, always be used no matter what.  It is also a place to initialize things that may cause the site to redirect, handle errors, logging, or permissions of routes.  Things like the view settings should not be initialized here.

Next, **dispatchLoopStartup** would be a good place to apply any modifications or initialization to things like the view.  This is before the dispatch starts, so it makes these resources available for all of the action methods.  Now, this isn't 100% free of still experiencing things like redirects but its close. (We could still issue a redirect at the end of a method).

Finally, **dispatchLoopShutdown** would be for initializing other resources that will only happen when a user is viewing a webpage and has little to no dynamic value.  For example, Google Analytics initialization or something similar.  (Very rarely do I find myself actually putting anything in here.  Even my GA is created in a view helper instead).

### What Problems Can This Cause?

There are two possible problems I've ran into with this.  First, the programmer can make a mistake by putting the wrong resource in the wrong hook.  This will happen from time to time.  Not the end of the world!  The second problem is a bit more deeper: Using PHPUnit to test Controllers.  When testing controllers, the test will extend Zend_Test_PHPUnit_ControllerTestCase.  This class has a setUp() method that re-initializes the request on each test method call.  This means that the bootstrap is reset.  All of the examples show running your bootstrap again in there instead.  However, if you bootstrap each method with your bootstrap, and then the controllertestcase class resets the front controller request, only half the of the request is valid.  This is confusing yet and something I'm aiming to fix in my test classes.  I'll post more when I have this figured out.  Long and short of it, the Zend_Test_PHPUnit_ControllerTestCase class seems to be set up requiring/expecting that your bootstrap is in the traditional version.

### What's your input?

Do you see positives or negatives of this setup?  Would love to hear your thoughts. 
