---
layout: post
title: Zend Framework Static Router URLs Not Found in Zend Navigation
tags:
- zend framework
---

For a CMS I've been working on, there are a number of custom routes that are added statically in a loop.  These point to specific ID's of articles on on the default module's page viewing controller/action.  Sometimes these routes need to appear in the Zend_Navigation output.  As you can probably guess, the logic used for this is similar to what you might experience when using the URL view helper.  But, for some reason, I could never get the URL's to be marked as active.

Here is an example of the code that was being executed in the setup plugin:

{% highlight PHP %}
<?php
$route = new Zend_Controller_Router_Route_Static(
   'custom-url-1',
   array(
       'module'=>'default',
       'controller'=>'page',
       'action'=>'view',
       'id'=>101,
   )
);
                
$router->addRoute('custom1', $route);

$route = new Zend_Controller_Router_Route_Static(
   'custom-url-2',
   array(
       'module'=>'default',
       'controller'=>'page',
       'action'=>'view',
       'id'=>102,
   )
);
                
$router->addRoute('custom2', $route);
{% endhighlight %}


Well, it turns out that its impossible for the URL handler to know which route to use.  It can match it, sure, but it doesn't know how to recompile it (that's my best guess at least...).  So, in order to tell it to form it in the default way, I added the 'route'=>'default' attribute to the arrays and this seemed to work.

So now, for example, this is what you'll find:



       array(
           'module'=>'default',
           'controller'=>'page',
           'action'=>'view',
           'id'=>102,
           'route'=>'default'
       )
    



Hope this helps someone else out!  If you know exactly why this works, feel free to comment.
