---
layout: post
title: Using Your Namespace for Optimum Readability
tags:
- php
---
I love [namespaces in PHP](http://php.net/manual/en/language.namespaces.php) as much as the next programmer - but there's always been something about namespaces in my own applications that bothered me.  And that's when I have similar or identical named services, forms, entities or models.  

As you know, you can use fully qualified names of classes, but programmers are lazy, so we like to use aliases or just fully import the class.  `MyApp\Service\User` becomes `User` or if you're fancy, `MyApp\Service\User as UserService` yields a better result.  
Often times, my IDE does some of this work for me.  But let's imagine I let it do that - and I have two User named items, a service and a form.  How often does this happen?

```php?start_inline=1
use MyApp\Service\User;

class Controller
{
  public function doSomething(User $user, \MyApp\Form\User $form) {}
}
```

Ugh - just not all that readable.  What's the first User?  A service? A model?  You don't know unless you look at the top of your file and see.

What I've been doing lately is importing my namespaces in my application a step up.  It makes for a more readable solution.  Imagine this code now with my solution:

```php?start_inline=1
use MyApp\Service;
use MyApp\Form;

class Controller
{
  public function doSomething(Service\User $user, Form\User $form) {}
}
```

It's much more clearer now what these parameters are.

Now, this is just an opinion piece here.  I'm sure there are reasons why you wouldn't want to import that whole level of the namespace in - but if you're working entirely in your own code base, I just think this makes it easier to read.
