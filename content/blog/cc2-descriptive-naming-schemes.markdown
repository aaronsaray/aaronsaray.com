---
title: Descriptive Naming Schemes
date: 2016-03-02
tag:
- php
---
There are two reactions to reading a new section of code for the first time.  Sadly, one of the most common seems to be of confusion, dismay, followed possibly by some sort of expletive (or many, depending on the length of the code).  The other is one of the most beautiful reactions, the most flattering, the most sought after reaction: "Oh, that makes sense" or "That's cool."

<!--more-->

### Episode 2: Descriptive Naming Schemes

As a Confident Coder, the code that we strive to write should illicit that second response as much as possible.  Whereas some languages benefit from minification, PHP does not.  Code should be efficient, but that doesn't mean obfuscated and confusing.  This is where proper descriptive naming schemes come in.  

#### The Method for Naming Functions
When I first started planning this month's column, I began writing about quality commenting in code.  In one of the examples, I was struggling with how much commenting to put in a Doc-block above an example function.  (Or a method - I have to admit, the wordplay in this section title made me laugh to myself just a little too much.)  I couldn't really develop a concise, accurate comment because the method required too much explanation.  Even the name was confusing.

When naming functions, it is important to consider the actual content of it.  What is this function tasked to do?  (Perhaps it is tasked to do too much, so that's where the confusion comes in with the name.  That's a discussion for another column.)  And specifically, what set of nouns and verbs best describes the function.  A function or method name should reflect the task it will do as well as the context of said task.  That is to say, if the task is applied to a specific variable, collection, or model, that should also be reflected in the naming scheme.  We'll take a look at this more later in the examples at the end.

#### Naming Variables
Let me tell you about a nightmare I have.  I open a code block and I see the following variables: `$DDU`, `$DDA`, `$DDUA`, and `$DSU`.  They are used throughout a file that contains thousands of lines of code.  Each one reflects a different permission level.  Each one allows different access to various resources.

Sadly, this is not just a nightmare.  This reflects a real code base I inherited many years ago.  The naming apparently reflected an internal method of describing various levels of users and company support staff.  Let's not forget I was new to the company so I barely understood the product, let alone what various levels of hierarchy existed in the company.  As you can probably guess, I was very nervous for many months while working on this code base.  I was never confident any of my changes would actually work properly.

As I said earlier, PHP does not benefit from the minification of variables.  Yet, there still seems to be a habit of making variables that are single letters or very short abbreviations of words.  (I believe PHP itself is slightly to blame: I'm looking at you `strlen()`!)  But, it doesn't have to be this way.  It shouldn't be this way.

Variables should be named in a descriptive way that describes their usage, their state, their content, or any combination of these.  For example, when storing your favorite fruit, you have a choice between `$a` and `$apple`.  Use `$apple` to clearly describe the item.  There is no benefit to using a short variable like `$a`.  In fact, months later when you review the code, or when a new programmer looks at it, the named variable `$apple` is a clear indicator to the content whereas `$a` most likely has to be traced farther up the code to see what that variable actually means.

#### What are the rules?
I don't know if I can answer that question.  I've given pointers in the last two sections on best practices for choosing a naming scheme.  However, when choosing function and variable names, I consider the following two questions: "Will this reduce the commenting I need to do?" and "Does this code read like a sentence?"  If you can answer yes to both of those, you're on the right track.  

#### An example to refactor
In this example, the function listed is the last step of an insurance process.  It will add the primary insurance holder to the collection of dependents or members in the policy if the holder is not already part of the collection.

```php<?php
function lastStep($p, $ms)
{
  $tmp = false;
  foreach ($ms as $m) {
    if ($p['id'] == $m['id']) {
      $tmp = true;
    }
  }
  if ($tmp == false) {
    $ms[] = $p;
  }
  return $ms;
}
```

As a Confident Coder, you probably can see a lot of problems with this code.  You might even do it differently, and that's fine.  But today, we're going to refactor the variables and method names only.

First, the method.  I don't know what `lastStep()` really means.  This would require me to add a pretty descriptive comment to this method to explain what is actually happening.  What's even worse is the possibility that another step may be added later.  Then, what would you call the new function?  `seriouslyLastStep()`?  In this case, I know that this method will add the primary holder to the collection if it isn't already there.  Perhaps a name like `addPrimaryToMembers()` is better.  That still doesn't reflect the necessity to not duplicate the primary in the member list, though.  One could accomplish this explanation through the comment or create an even more explanatory method name: `addPrimaryToMembersIfMissing()` perhaps?  There's no hard and fast rule on what verbs and nouns you must use.  The goal is to make sure that, at the very least, the method name reflects the task or action better than something like `lastStep()`.

Next, on to variables.  The variable `$tmp` is particularly troubling.  We're all guilty of doing something like this, I know I am.  But as a Confident Coder, we now commit to never doing this again, right?  What does this "temp" variable actually mean?  In this case, it reflects the status of something being found.  So perhaps something like `$isPrimaryFound` is a better name.

Moving on: `$p`, `$ms` and `$m` are my last culprits.  If you know the reason for the method, you can probably guess these stand for primary, members and member.  But, if you are not familiar with the process, these naming choices are very confusing.  Let's refactor these into the proper names.  See the following updated code:

```php
function addPrimaryToMembersIfMissing($primary, $members)
{
  $isPrimaryFound = false;
  foreach ($members as $member) {
    if ($primary['id'] == $member['id']) {
      $isPrimaryFound = true;
    }
  }
  if (!$isPrimaryFound) {
    $members[] = $primary;
  }
  return $members;
}
```

#### End Notes

Now, I feel confident that this code block reads clearly and is not so confusing.  I can read the code from start to finish without having to make any inferences on what each variable name means and what this function is primarily responsible for.

You have a great amount of freedom when choosing names for methods and variables.  There are many code standards which will give you pointers on how to name your items, though.  Remember to consider how your methods and variables read in the code.  Does your choice in naming require explanation?  If so, refactor until it reads like a sentence using verbs and nouns.  Then, you can confidently hand your code over to anyone with the knowledge that you'll get the prized response: "Oh, that makes sense."

> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.
