---
layout: post
title: Attention to Detail
tags:
- php
---
Every leader has a particular methodology or key point they focus on.  Whether it be a small detail, a general philosophy or a repeated phrase, you know that if you are near that leader, you will become very familiar with their demand.  In my team, my demand is to pay attention to detail.

### Episode 5: Attention to Detail

During some of the first code reviews with my team, I would chant this mantra over and over.  Pay attention to detail!  I would say it, I would write it, and sometimes you'd hear me yelling it from my office.  At first, I think it angered my team.  Then, they started using it to mock me.  Now, they've found appreciation for it - and I hear them using it with each other.

As a Confident Coder, I'm certain you've repeated this phrase to yourself too, right?  You don't have to repeat it - it's how you program - it's how you live your life!  But, what happens if you don't pay attention to detail?  Let's look at just a few examples.

#### Problem 1: Always True Conditionals

If you aren't paying attention to detail, you might miss the mistake in the following bit of code:

```php?start_inline=1
if ($valueIsFour = 3) {
  // oh no!
}
```

The result of that `if` statement will always evaluate as true.  The programmer probably meant to do a comparison `==` but instead executed an assignment `=`.  

#### Problem 2: Nested Quotes

It can be difficult to deal with nested quotes.  This can get especially bad when creating HTML from PHP.  Introduce variables, concatenation, and a lack of consistency to the mix, and you may have a problem.

```php?start_inline=1
echo '<a href="' . $link . "'>Click Me</a>';
echo '<span id="' . $id . '" class="' . $class . '>"Hi!"</span>';
```

In both of these lines, attention to detail is critical.  In the first example, the programmer alternates between single and double quotes to enclose the strings of HTML.  The end result is HTML with mismatched quotes around the value of the `href` attribute.  In the second example, the class attribute is missing a closing double quote.  While this is an extreme example, you can see where more complex lines of code require an even greater attention.

#### Problem 3: Incorrect Comments

Programmers are often called lazy.  I like to argue that we actually prefer efficiency.  But no matter what you call it, programmers generally will do the least amount of work possible.  One particularly useful tool we have in our arsenal is copy-and-paste.  Why would I retype a method declaration and a docblock if I can just copy from another one?

```php?start_inline=1
/**
 * Add sales tax
 *
 * @return float
 */
function addSalesTax($cost)
{
 // <snip> - code is not the point here
}

/**
 * Add sales tax
 *
 * @return float
 */
function addShippingCost($cost)
{
 // <snip> - code is not the point here
}
```

In order to save time, the first method named `addSalesTax` and its comment declaration were copied for the new method.  The method name was changed and new code was created for it.  But, the docblock remains a duplicate of the previous method's comment.  If you're in a hurry and not paying attention, this type of mistake is easy to make.

### End Notes

We work in an industry with 1's and 0's - there is right, and anything else is wrong.  Something not precisely right is a bug.  Our work demands detail.  It's fun to be the fastest or most innovative programmer out there.  But true Confident Coders know that accuracy is the most important.  They pay attention to detail.

> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.
