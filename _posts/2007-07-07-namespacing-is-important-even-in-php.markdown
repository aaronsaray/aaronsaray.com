---
layout: post
title: Namespacing is important - even in PHP
tags:
- PHP
---

Perl, Java and xml people are very aware of what a namespace is... even [wikipedia](http://en.wikipedia.org/wiki/Namespace_(computer_science)) tells us they are.  But, certain languages, such as PHP, don't support namespaces yet.  (However, thank you Dmitry for [your proposal](http://aspn.activestate.com/ASPN/Mail/Message/php-dev/3519062).)  But are namespaces really important?  PHP has made it this far without them, so why should you be concerned?  Well, lets see:

PHP should support namespaces, thats my main point here.  Right now, there is no logical way to support multiple common names (although PEAR has made good progress... but it kinda sucks when a class declaration is something like: name_space_declaration_class extends other_namespace_class ... it just gets cumbersome - plus everything still is in the global namespace).  PHP6 may come out with this support, but its yet to be seen (see Dmitry's proposal).  But in the mean time, are we restricted to long obtuse class names?

PHP's vast PEAR library has helped fuel many enterprise applications (for those who argue against PHP's enterprise-readiness, [here's to you](http://phplens.com/phpeverywhere/node/view/15)),  even they fell victim to this lack of namespacing.  Whenever PHP introduces new functions, its part of the global namespace - the same as any function or class method - and when PHP released the new date() function, it broke a main PEAR class which had method called date().  This is just one example of where a namespace would have been useful.

Is there a solution in the mean time?  Yes: two actually.

The very first is to prefix all of your function names with a short identifier that you're pretty certain PHP won't use.  For example, you do NOT want to use 'mysql_' as a prefix (as there is a chance that more mysql functions may come out in PHP in the future, and then you're in trouble...), but you might choose your project's initials 'JD' for example.   However, be careful with what you choose here so that its not too restrictive to your project.  A real life example from ("the triangle") is our prefix: DD.  This worked fine for a good portion of our sites - but when we started working on different sites that weren't related to a DD, it became confusing.  I'd recommend doing something more generic - in this case we could have used 'AD' as that was a more generic initial for our main company.

The second is to roll homemade namespaces, such as what [Drupal](http://drupal.org/) does. This solves some of the issues, but it still competes with the global namespace of PHP functions (as far as I can tell...).

So, even with these two solutions, I still believe there is a big need for PHP namespaces.  Lets see what happens with PHP6...
