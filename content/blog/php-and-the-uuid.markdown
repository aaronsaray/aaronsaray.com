---
title: PHP and the UUID
date: 2009-01-14
tag:
- php
---
I've been thinking more and more about having unique ID's - especially with working with larger datasets - and I thought it was high time that I investigated the UUID.

<!--more-->

The first time I ever heard about these was actually Microsoft's implementation of the GUID in the CLSID sections of the windows registry.  However, if you check out the [RFC for UUID](http://tools.ietf.org/html/rfc4122), you'll see that's just one of the uses and types.

My chosen UUID is V4 in PHP.  I checked out the [php.net/uniqid](http://php.net/uniqid) page and reviewed the comments.  I still had a few questions, but settled on one example.  Let's dissect this now...

## UUID is Hex

So, let's make sure we fully understand our integer formats [http://us2.php.net/manual/en/language.types.integer.php](php.net/integer) specifically our hexadecimal format: `0[xX][0-9a-fA-F]+`  From this, we should start to think of our min and max ranges for our UUID in hex: between `0` and `0xFF...(many f's)`.

The next thing I want to make sure is that PHP doesn't convert my hex to something base 10 - so let's format it properly with the `sprintf()` function.  Note the description of the last parameter:

> x - the argument is treated as an integer and presented as a hexadecimal number (with lowercase letters).

Excellent!  So, now we can deal with Hex solely - and PHP is amazing because any function that works with integers, can work with Hex - as they are just a different base of integer (math wizards are going - duh aaron... I just like being verbose... :) )

## The basic format of the UUID

The basic format of the UUID - and I'm talking real basic - is:

```txt
########-####-####-########### where # is a hexadecimal number.
```

Of course, those nodes actually mean something (per the rfc):

UUID = `time-low` "-" `time-mid` "-" `time-high-and-version` "-" `clock-seq-and-reserved` `clock-seq-low` "-" `node`

## What makes this v4?

RFC states:

> The version 4 UUID is meant for generating UUIDs from truly-random or pseudo-random numbers.
>
> The algorithm is as follows:
>
> o  Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
>
> o  Set the four most significant bits (bits 12 through 15) of the time_hi_and_version field to the 4-bit version number from Section 4.1.3.
>
> o  Set all the other bits to randomly (or pseudo-randomly) chosen values.

And 4.1.3 states the binary value of this:

> 0     1     0     0       version 4: The randomly or pseudo-randomly generated version specified in this document.

So, what that all means is that we need to set those bits properly in each sub section after we've generated our random number - doesn't sound so bad.  Just use the bitwise operator.

## PHP and generating the random number

Ok - first off, let's generate some random numbers with `mt_rand()`.  The middle two sections are not a problem what so ever... we'll use use

```php
mt_rand(0, 0xffff);
```

However, what about the next bigger one, the 8 digit one?  Well, I'm using a windows machine in 32 bit - so I did a bit of math here:

```php
var_dump(0xffffffff);
print mt_getmaxrand();
```
    
Outputs were: 4294967295 and 2147483647 respectively, so I know we'll have to break that up.  Basically, we'll use 2 random numbers dash one random dash one random dash three random numbers.  sprintf will take care of the padding.

## Ok, putting it all together

The best example of all of this - and what I used to kind of reverse-engineer for this article, was from the PHP manual, check it out:

```php
sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));
```

Simple enough, proper sprintf format, all the random number generators in place, and then the bitwise operators to set the bits properly.

So - with all that said, do YOU use a different way to generate a UUID in PHP - or do you think this is the best one?
