---
layout: post
title: PHP Templating Languages Indicate a Problem Elsewhere
tags:
- php
---
I can't help but think a lot of PHP applications have a problem.  These beautifully crafted, object oriented, highly engineered applications are still making one vital mistake.  And that's using one of the [various](http://twig.sensiolabs.org/) [templating](http://platesphp.com/) [libraries](http://www.smarty.net/) or languages that PHP has.

So - why do we use these - and what's the problem/solution?

### What's the Problem

First, let's dig into the reasons why template languages exist in PHP - or at least 'excuses' I've heard for them.

**Designers and Front End People Don't Know PHP**  
This argument is simple: Front end or designers can't know the extreme complexity of PHP - and therefore they need a simpler language in place of PHP in the view layer.  I disagree - I think that each template language deals with things the same way.  There are variables, for loops, filtering.  These are all things that PHP provides as well - and in a very simple way.  Let's take a look at a simple loop in Twig and one in PHP.  

```twig
<ul>
 {% raw %}{% for thing in things %}{% endraw %}
   <li>{% raw %}{{ thing }}{% endraw %}</li>
 {% raw %}{% endfor %}{% endraw %}
</ul>
```

So, in Twig, you have a for loop - which is very similar to a foreach in PHP - and a simple output statement in the loop.  What's troublesome to me is that the user now has to know that there are two syntaxes in Twig.  The brace-parenthesis which indicates a functional call and double-brace which indicates an output.

```php?start_inline=1
<ul>
<?php foreach ($things as $thing) : ?>
  <li><?= $thing ?></li>
<?php endforeach; ?>
</ul>
```

In PHP, it's very similar.  We use the foreach function, and use inline output.  We do have a similar problem here with the apparent two syntaxes.  The `<?php` begins a logical or code group - and the shorthand `<?=` indicates an output.

But the point is - there really isn't much difference here. I say if a person can learn Twig, they can learn a simple PHP template as well.

In fact, there are arguments that PHP is a templating language anyway, so...

**PHP Templating Languages Separate Concerns and Logic**  
I've heard the argument that we need to make sure we don't do logic inside of our views.  I agree!  And then I've been pitched a template language as the answer.

But, let me submit this bit of code in Twig:

{% raw %}
```twig
{% if loggedin %}
You are logged in!
{% else %}
Please log in!
{% endif %}
```
{% endraw %}

At the very basic level, this is a logical choice.  In fact, there's always going to be a small bit of logic in our views unless we really want to generate so many different views that there never is a choice - but then that's a lot of code duplication!

**Templating Languages Make it Easier to Escape User Input**  
I can't argue that some of the escaping is super cool - like this in Twig:

{% raw %}
```twig
Hola, mi nombre es {{ user.name|e }}
```
{% endraw %}

This is a super easy way of using the HTML escaping strategy in Twig.  But I'd argue against this reason of doing things because - well - because of reason number one.  If the consensus is that designers or front-end people don't have the necessary skillset to use PHP as their template language, you're assuming that they do have the skillset or will remember to escape all user input (boy - that sounds very programmery to me).  As a matter of fact, even disciplined back-end programmers forget or overlook proper escaping from time to time. :)

**Some other argument**  
Yup - there are a lot more arguments - and I don't need to get into the details.  

I think it's more important to get to the "answer" - if I'm against templating languages, does that mean I'm just for some advanced PHP in the view layer - or what is it that I want? WHAT DO YOU WANT AARON?!

### What's the Solution

First of all, I think it's important to draw a line - a distinction between a healthy view layer library and a templating language.  A view library has a nice set of hooks and functions that make using your templates easy.  It doesn't necessarily dictate which language the actual view file needs to be in.  I am not in favor of getting rid of quality view libraries.

In fact, I'm even more for view libraries before the actual view file.  What I think a lot of applications are missing is a proper, "fat" *View Model* that gets passed to their view file.  Let me explain.

If you're building a PHP application, your view file should be a mix of HTML and PHP (Or javascript and PHP or... basically it should be using PHP for the dynamic output).  However you plan to pass your dynamic information to your view file is up to you.  (Some use "global" variables to the view file.  Others might choose to make the view file part of an object, so that each variable is an instance variable.)  Either way, the missing part here is the logic, filtering and altering of data before it actually goes to the view.  

This should all happen in a view model.

Let's say your controller calls a service to retrieve a user model.  Let's say that you need to show the user's name to the browser.  I've seen a number of different ways this is done, but two common ways are: a) retrieve the name from the object and pass that directly to the view file or b) pass in the whole object to the view file.

Let's see why both of these are bad.

**Send the entire object**  
This is the worst solution.  This means now that the view layer has to understand how the user object is built and how data is accessed.  And, it also provides additional extra information to the view layer that is not needed.  With a bug or an oversight, this extra information could get exposed and cause a security issue.

**Retrieve the name from the object**  
This is really close to the proper solution.  But, then do we filter it before we send it to the view? Or is it sent afterward?  Do we always do it the same way?

The solution is to use the view model.  Let me add the extra step in here:

- Controller calls service to get a user model
- Empty View Model is created
- User name is retrieved, filtered and applied to the view model
- View model is the only thing sent to the view file

With this methodology, we can make the assumption that the front-end person never has to worry about filtering the output.  Any user input will be filtered before it is added to the view model (this might be some sort of automated process).  But, there is only one thing passed to the view - and this thing contains only the information that is necessary.

Another thing that this helps with is distilling complex information down into easy to understand tabular display.  Imagine you have a collection of objects that have some dependencies.  Your display has to show the main object and some information about it's dependency.  A good example of this is a book and its author.

In some systems, you might get a collection of books - and pass that to the view.  The view might be responsible for retrieving the author information.  Worst case scenario - there are additional calls to the data source *from the view* to get the author information.

Instead, with the view model paradigm, all of that looping and data retrieval is done before the view file even gets ahold of it.  And instead of sending data objects to the view, we're probably just going to build a very simple array of data.

### End Notes

Now, with every suggestion or argument, there are flip sides and other arguments.  I get that, but I think most of the arguments are dwarfed compared to the separation of concerns, security, stability and performance of a PHP-based template with a view model.
