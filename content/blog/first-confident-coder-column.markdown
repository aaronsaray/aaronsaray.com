---
title: First Confident Coder Column
date: 2016-02-22
tag:
- php
---
Sweaty palms, a fast heart rate and an overwhelming sense of dread.  

<!--more-->

## Welcome

What could have brought on this primal fight or flight reflex at 2p.m. in an air conditioned cubicle under the slightly annoying buzz of fluorescent lamps?  One small phrase, three simple words from your boss or the lead architect: "Code Review Time."

If you're like me, you're just a bit apprehensive and slightly defensive when it comes to code review.  Perhaps this comes in the form of a scheduled review from a peer or a team lead.  Or, even something as simple as seeing comments on GitHub after your most recent commit brings out this feeling.  Years ago, I started to fear the commit.  I was afraid to call something done.  I wasn't sure about my code.  I feared it would get ripped to shreds.

And most of the time, it did!  But, instead of turn into an angry, bitter old programmer (and troll some mailing-lists and forums), I decided to take matters into my own hands.  I wanted to be proud of my work.  I wanted to be a _Confident Coder_.

The _Confident Coder_ column is my reflection on the things that I had to do to make sure I never feared a code review again.  So many times we get lost in the flurry of new frameworks, features and tools, that we forget our roots.  The _Confident Coder_ is all about building a strong, accurate, confident base in PHP.  Each month, I'll examine some core principals and tenets in PHP, explain how to make the best choices when faced with common programming scenarios, and use pure PHP to solve everything.  No frameworks, no libraries, just solid core PHP.  

I look forward to joining you on this journey as I explore the simplicities (and sometimes complexities!) of plain PHP.  Let's never fear showing our code again.  Welcome to confident coding.

### Episode 1: Detecting the POST Request Method

Some applications have different work-flows based on whether the current request is GET versus POST.  If you have a favorite framework, there probably is something built in that can help you detect this rather easily.    For example, in Zend Framework 1, you can check with a call to `Zend_Controller_Request_Http::isPost()`.  Wow - what a time saver!  But what if you're writing your PHP code with no library or framework?  

In this example, we need to detect if the current request was issued as a POST.  The goal is not necessarily to test the values that are posted but simply to determine the method.  Why am I being so specific?  Imagine that one of the methods called to validate a POST value required a significant amount of processing power.  You'd hate for that to run regardless of whether this request was a GET or POST.  It is best to test the request type as soon as possible.  The sooner that this can be determined, the sooner the request can be ushered to the proper work-flow potentially saving processor cycles and creating a faster, more controlled page load.

After doing a number of code reviews, I've noticed a common methodology that some PHP developers use to test if the current request is POST.  

```php
if (!empty($_POST['firstname'])) {
  // assume this was a post and move forward
}
```

In this case, the programmer knows that the previous page will have a form that has a field named `firstname` and that this will be sent on a posted form.  However, there is a flaw in this method.  What if the first name field in the form is blank?  Recognizing this, the next iteration that is common is the following:

```php
if (isset($_POST['firstname'])) {
  // assume this was a post and move forward
}
```

This iteration checks to make sure that the post variable of `firstname` was indeed set, but it may be blank.  

But, as confident coders, we're not OK with this yet, are we?  I'm not.  I don't think it is as accurate as it could be - plus it requires that I rely on the `firstname` form field to always exist.

Let me submit the final iteration:

```php
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
  // this is a post so move forward
}
```

First, we validate that the super global `$_SERVER` array has the key of `REQUEST_METHOD`.  It is not a good idea to test a value against an array key without validating that the key actually exists.  Using `isset()` first will determine that the key exists before we attempt to test the value.  (Please note that `isset()` will return false if the key does exist but the value is NULL.  In this particular case, that's fine.)  Next, we check to make sure that the request method is identical to `POST` exactly.

### End Notes

Now, I am confident that I can determine if this was request was indeed a POST.  And, in the spirit of confident coding for peer review, please feel free to send me your thoughts, questions, or critiques.  If you'd like me to cover something in an upcoming column, don't be afraid to ask.  

_This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news._
