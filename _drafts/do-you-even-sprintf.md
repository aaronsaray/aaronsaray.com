---
layout: post
title: Do you even sprintf?
tags:
- php
---
"Do you even lift, bro?!" What a way to ask if you work out while simultaneously insulting you. Well, maybe I shouldn't have named this "do you even sprintf" but it really surprises me how many PHP devs forget about (or don't even know about) this useful tool - and instead do some pretty icky looking string concatenation. Let's take a look at what sprintf can do for us.

If you're curious, you can check out a bunch about the [history of printf formatting](https://en.wikipedia.org/wiki/Printf_format_string).  PHP provides a number of functions in this family: `printf`, `sprintf` and `vsprintf`.  For this entry, I'm going to just gently introduce you to [sprintf](https://www.php.net/sprintf).

`sprintf` follows the general `printf formatting standard` but instead of echoing the output (like `printf`), it returns a string.  The first parameter is the string format template, and the rest are the replacements for the template.

Time to learn the very first, basic formatter: `%s`. This stands for string. The string you specify in the position in the arguments will be replaced.  Let's check it out:

```php
$first = 'Ford';
$second = 'Chevrolet';

$out = sprintf('Some like %s, others like %s.', $first, $second);
```

This will output `Some like Ford, others like Chevrolet.`. You can see that the first variable is passed in as a string in the first place. The second goes in the second place.  

Other ways you could have done this are like:

```php
$first = 'Ford';
$second = 'Chevrolet';

$out = 'Some like ' . $first . ', others like ' . $second . '.';
// or
$out = "Some like {$first}, others like {$second}.";
```

As a simple example, there doesn't seem to be a lot of benefit.  But, let's move on.

Let's check out some more complex formatters and features.

The `%d` represents a signed integer.  The `%f` represents a locale-aware float.

What do you think this looks like?

```php
$number = 3.6;
$out = sprintf('d is %d, f is %f', $number, $number);
```

It's `d is 3, f is 3.600000`.  The first is the integer representation (notice that it doesn't round), the second is the float.

Ok, so now I should say that the `%` actually means that you're about to issue a formatting instruction.  There can be more besides these singular letters.  Actually a lot more.  Let's look at padding a number.

The `'` character indicates a padding character.  Let's check this out.

```php
$page = 26;
$title = 'Chapter 2';
$tableOfContents = sprintf("%s%'.20d", $title, $page);
```

This will add padding of up to 20 characters minus the length of the page in characters.  The output of this is:

`Chapter 2..................26`

What would that look like without this function?

```php
$page = 26;
$title = 'Chapter 2';
$dots = str_repeat('.', 20 - strlen($page));
$tableOfContents = $title . $dots . $page;
```

Not _that_ bad but I hope you can see how this starts to make things easier to understand and build - especially when dealing with string templates and concatenation.

There's so much more here to learn. Check out [sprintf](https://www.php.net/sprintf) for more!
