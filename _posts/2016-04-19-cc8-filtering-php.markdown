---
layout: post
title: Filtering PHP
tags:
- PHP
---
> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.

### Episode 8: filter_var to the Rescue!

I like to think that I'm somewhat of a PHP purist.  And, when I travel to user groups, one of my favorite talks to give is named "Tell Aaron What To Do."  Basically, the goal is to solve two problems I pose using plain HTML and PHP.  Oh, and do it with core PHP, no frameworks, no libraries, just plain vanilla PHP.  At the end, I'll run a number of integration and security tests against the code the group has written to see if we were successful.

> I don't have anything against frameworks.  I've used Zend Framework as the basis for a number of projects.  However, I find that too many people rely on frameworks for every single little thing, and that can be bad!
> 
> Before you implement a framework, you should research it, read the documentation, and do a basic code review.  If you're seeing things you're not familiar with as part of the framework, it's your responsibility to learn about those concepts.  I've seen a trend lately that PHP programmers just blindly download something from Github and hope for the best.  Just because the source is available doesn't guarantee that anyone has actually reviewed it.  If there is a bug or a security hole in the framework, it will effect your application.  You're still responsible.  
>
> Also, not all development is new.  If you ever have to work on legacy code, you should be able to manage your way through it without the need to implement a framework to solve a simple problem.

**Continue the entry!**

One of the challenges requires the group to build an email form.  I sit at the keyboard and request that the group tells me what to type.  When necessary, I pose questions and hints like: "Don't forget we have to validate that the email address is correct."  One time I posed this question and was answered with a lengthy silence.  Then, someone timidly asked: "Can we import Zend_Validate?"  I said no - that's a framework tool!  Then I heard comments rumblings about not being experts at regular expressions.  One more hint from me and we were on our way: "don't reinvent the wheel," I said.  "Check out php.net/filter_var."  

#### What is filter_var

The mumbling in the group turned to elated sighs when the programmers using iPads got more familiar with the function `filter_var()` in PHP.  This particular function is pretty straight forward: it filters or sanitizes a variable based on some criteria.  

It's important to understand the two major use cases for `filter_var()` .  The two types of filters most used are validate and sanitize (there is a third called callback which functions in a similar method to sanitize).  The validate type of filters are used to validate if a variable is of the type given as a flag to the command.  `filter_var()` will return a boolean representing whether the input was valid according to the rules set by the filter flag.  Sanitize filters function differently.  `filter_var()` will  return a sanitized version of the input variable according to the rules represented by the sanitize flag passed in.

#### Some examples

The following two blocks of code will demonstrate how `filter_var()` works precisely.  And since I mentioned email filtering as a pain-point during the last group talk I gave, let's take a look at the email functionality for `filter_var()`.

```php?start_inline=1
var_dump(filter_var('guy@smiley.com', FILTER_VALIDATE_EMAIL));
var_dump(filter_var('not_an_email', FILTER_VALIDATE_EMAIL));

var_dump(filter_var('guy@smiley.com', FILTER_SANITIZE_EMAIL));
var_dump(filter_var('prob()lem@email.com', FILTER_SANITIZE_EMAIL));
```

The output from this PHP is below:

```php?start_inline=1
string(14) "guy@smiley.com"
bool(false)
string(14) "guy@smiley.com"
string(17) "problem@email.com"
```

First, the validate filters are ran.  The first value is a valid email address so the boolean `true` is returned.  The second is not a valid email address, so `false` is returned.

The next example is using the sanitize filter.  The third line of output is identical to the input parameter because there was nothing in the string to sanitize or remove.  However, the fourth line shows something slightly different.  Because there was an invalid character in the input to `filter_var()`, the output and the sanitize email filter flag made `filter_var()` remove it.  The output is a fully valid and sanitized email address.

#### End Notes

Confident Coders know they don't need to reinvent the wheel.  PHP has a number of methods to solve a lot of problems for us, so make sure to take advantage of them.  I would recommend checking out the documentation for `filter_var()` on php.net.  Additionally, check out the 'Types of Filters' manual page: [http://php.net/filter.filters.php](http://php.net/filter.filters.php).  

One last caveat I'd like to mention: make sure you understand the filter flag you have implemented.  Sometimes the descriptions in the manual aren't that clear.  Read through the comments on the pages to find out what other programmers have ran into.  For the most part, they will solve your filtering problems.  If not, there's always regular expressions!