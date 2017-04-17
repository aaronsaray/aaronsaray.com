---
layout: post
title: DIRECTORY_SEPARATOR is Useless!
tags:
- PHP
---
The predefined PHP constant `DIRECTORY_SEPARATOR` is useless.

When evaluated, the constant is as follows:

    *nix: /
    win: \

So, to the casual observer, there seems to be a real need for this constant - especially with those who favor the php command `getcwd()`.  However, for the most part, it is just wasteful - and potentially error prone to have around.

For the slashes, Windows will work with `/` (even though its constant return is `\` - and the backslash is used normally throughout the filesystem).  Windows will also work with `c:\blah\blah/additionalblah/moreblah.php` (note the mixed slashes, just in case you happen to mix a call to something like `getcwd()` and your hardset path with the forward slash).  *nix will not (you cannot do `/usr\bin/funstuff`)

I also ran across a case one time where - through some strange fate of mangled programming, the `DIRECTORY_SEPARATOR` on windows encased in a string started escaping certain characters of the filename.

One final note - someone on the PHP.net manual page suggested this function - if you really MUST use `getcwd()` - and in the case you're using `explode()` to figure out something about the path:

```php?start_inline=1
return gstr_replace('\\', '/', getcwd());
```
