---
title: Adding Subdomain Routes for all URLs in Zend Framework
date: 2011-07-12
tag:
- zend-framework
---
All the examples I've seen for pulling information from subdomains are from the [hostname](http://framework.zend.com/manual/en/zend.controller.router.html#zend.controller.router.routes.hostname) router directly correlating one subdomain as a value to a single controller/action combo.  This means they map username.website.com to something that basically looks internally like `website.com/user/profile/var1/username`.  This is cool for simple one off tasks - however, what if you're creating a multiple controller/action solution?  For my example, I'm creating a CMS that will have a shared code base.  However, on every page, I need to know exactly which site this is.  

<!--more-->

**Enter Chaining!**

So far, all the examples have shown how to chain a hostname route to a single other route.  Like I mentioned, this solves the singular `subdomain->action` connection.  However, now I need to apply it to all of my routes.

In my example, I'm going to make sure that the following code is at the very end of adding all of my other standard routes.  If someone adds a route AFTER this code, it will not work correctly for their routes.

Use the following code:

```php
$router = Zend_Controller_Front::getInstance()->getRouter();

$hostnameRoute = new Zend_Controller_Router_Route_Hostname(":sitename.example.com");

$router->addDefaultRoutes();
foreach ($router->getRoutes() as $key=>$route) {
  $router->addRoute('hostname' . $key, $hostnameRoute->chain($route));
}
```

First, the router is retrieved again.  Next, the hostname route is created. In this case, our domain is example.com.  I want to have a parameter called sitename in my controllers.  Next, I force the router to add its default routes right now.  Normally this is done after custom routes.  Finally, each route that now exists, the default routes, the custom ones you've written, etc, are all looped through.  A new route is added which is basically named after that route with the prefix of 'hostname'.  The route is a chained version of the original with the hostname.

Now, when visiting `site1.example.com/blog/add`, the parameters array in the controller will be:
    
```
'sitename'   => 'site1',
'controller' => 'blog',
'action'     => 'add'
'module'     => 'default'
```
