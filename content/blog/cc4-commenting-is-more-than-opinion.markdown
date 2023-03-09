---
title: Commenting is More than Opinion
date: 2016-03-14
tag:
- php
---
In an earlier column, I discussed the advantage of using longer and more verbose variable and method names.  When you program using this more descriptive style, the code is easier to understand and more maintainable.  However, a short and concise method with a revealing name may not always be sufficient when it comes to complex processes.  To fill this gap, PHP has comments.  

<!--more-->

## Episode 4: Commenting is more than just giving your opinion

There are two different reasons why you might create comments in your code: automated code documentation systems and explanation of complex concepts or processes.  But first, let me share with you my favorite comment ever:

```php
// do the magic
```

Be honest, you've probably done this before.  Or, in an angry rush, you might even have riddled your code with something far worse.  That's ok, I forgive you.  But now, let's put that in the past and move on with more constructive commenting.

### Commenting for Automated Code Documentation

Automated code documentation can be a very useful thing for yourself, your team, and other programmers implementing your code.  Basically, this system allows generation of documentation based on the commenting in your code.  

The most common standard for this documentation in PHP is called PHPDoc.  To get more details about this standard, go to PHPDoc's official website phpdoc.org.  To create the documentation, you can either use the phpDocumentor tool (located at PHPDoc's website) or any other compatible tool like Doxygen (doxygen.org).  As an added bonus, most newer IDE's will use this standard to create pop-up comment tips and provide enhanced navigation from context given in your comments.

When creating comments for the automated code documentation systems, it is important to follow the standard described by the PHPDoc manual.  If you need more flexibility, you can create additional standards and configure your tool to parse for them.  The key here, though, is consistency.  Always create your comments by standard and keep them up to date.  Similar to a coding standard, following the commenting standard ensures quick and accurate parsing and consistency throughout the project.  While this may seem like a bit of extra work, the return is well worth it.  Confident Coders are confident their project contains quality code, but also proud to share documentation making it easier to follow for others.

### Commenting for Complex Processes

As a programmer learns PHP, their take on complex methods and the value of commenting follows a predictable path.  First, there are no comments.  Everything is a jumble of code that will make any other programmer's head spin.  Then, they will inevitably learn about commenting - and then go overboard!  You'll see stuff like this:

```php
/** add the two numbers here **/
function addTwoNumbers($first, $second)
{
  // perform the addition
  $total = $first + $second;

  // send back the output
  return $total;
}
```

This method is very simple and contains easy to follow code.  There are just way too many comments here.  Between both extremes, a middle ground will finally be found.  That's where the Confident Coder lives.

As a Confident Coder, you are already creating descriptive method and variable names and keeping your code simple and modular.  If a method is just a few lines of simple code, there is no need to document each portion of it.  What you should be paying attention to are complex processes where business logic is performed.

So, for example, if you've created a method to sanitize and trim excess white space, it is probably pretty easy to follow the code.  You may comment in a docblock above the method to describe what actually happens, but there probably will not be any comments in the interior of the method.  On the other hand, if you're creating a method that determines distance over a spherical distance, you may want to comment inside it to describe the complex method of integrating distance conversions and radians into a final number.  Or, if you're creating a method that applies a specific set of business rules to an object, it might not be sufficient to just have a docblock.  You may want to comment throughout to trace the logical decisions back to some of the business requirements.

There are no hard and fast rules for how to comment your code when it comes to logical processes.  However, as a Confident Coder, you might compare your code to a book.  For the most part, you can read through it easily and understand each page.  But, in areas where you've injected complex and new vocabulary, it might require some additional definition (in the form of code comments).

### End notes

I've traveled the whole route from "no comments" to "extreme commenting," blazing my own trail and then following a comment standard.  I can make two suggestions from my journey.  First, pick an automated documentation commenting standard and stick with it rigorously.  There's nothing more valuable than jumping into a project with proper documentation!  And second, make the commitment to writing clear, easy to follow code.  Realize that commenting is a necessity to explain complex business rules not a crutch for sloppy code.

_This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news._
